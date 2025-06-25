using ETLSpecification.Domain.Models;
using ETLSpecification.Domain.Interfaces;
using ETLSpecification.Infrastructure.Data;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Bson;
using ETLSpec = ETLSpecification.Domain.Models.ETLSpecification;

namespace ETLSpecification.Infrastructure.Repositories;

public class MongoDBETLSpecificationRepository : IETLSpecificationRepository
{
    private readonly IMongoCollection<ETLSpec> _collection;
    private readonly ILogger<MongoDBETLSpecificationRepository> _logger;
    private static readonly object _indexLock = new object();
    private static bool _indexesCreated = false;

    public MongoDBETLSpecificationRepository(IOptions<MongoDBSettings> settings, ILogger<MongoDBETLSpecificationRepository> logger)
    {
        _logger = logger;

        var mongoSettings = settings.Value;
        var client = new MongoClient(mongoSettings.ConnectionString);
        var database = client.GetDatabase(mongoSettings.DatabaseName);
        _collection = database.GetCollection<ETLSpec>(mongoSettings.CollectionName);

        // Create indexes for better performance - only once per application lifecycle
        if (!_indexesCreated)
        {
            lock (_indexLock)
            {
                if (!_indexesCreated)
                {
                    CreateIndexes();
                    _indexesCreated = true;
                }
            }
        }
    }private void CreateIndexes()
    {
        try
        {
            // Get current indexes
            var existingIndexes = _collection.Indexes.List().ToList();
            var indexNames = existingIndexes.Select(idx => 
                idx.TryGetValue("name", out var name) ? name.AsString : null
            ).Where(name => name != null).ToList();

            _logger.LogInformation("Existing indexes: {IndexNames}", string.Join(", ", indexNames));

            // Drop any index that might have unique constraints on ClientId
            var clientIdIndexesToDrop = indexNames.Where(name => 
                name != null && 
                name != "_id_" && 
                (name.Contains("ClientId") || name.Contains("clientId"))
            ).ToList();

            foreach (var indexName in clientIdIndexesToDrop)
            {
                try
                {
                    _collection.Indexes.DropOne(indexName);
                    _logger.LogInformation("Dropped potentially problematic ClientId index: {IndexName}", indexName);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to drop index: {IndexName}", indexName);
                }
            }

            // Refresh index list after dropping
            existingIndexes = _collection.Indexes.List().ToList();
            indexNames = existingIndexes.Select(idx => 
                idx.TryGetValue("name", out var name) ? name.AsString : null
            ).Where(name => name != null).ToList();

            // Create non-unique index on ClientId for performance only if it doesn't exist
            if (!indexNames.Contains("ClientId_performance"))
            {
                var clientIdIndexModel = new CreateIndexModel<ETLSpec>(
                    Builders<ETLSpec>.IndexKeys.Ascending(x => x.ClientId),
                    new CreateIndexOptions { Name = "ClientId_performance", Unique = false }
                );
                _collection.Indexes.CreateOne(clientIdIndexModel);
                _logger.LogInformation("Created non-unique ClientId performance index");
            }// Create index on BusinessDomain for faster queries
            if (!indexNames.Contains("BusinessDomain_1"))
            {
                var businessDomainIndexModel = new CreateIndexModel<ETLSpec>(
                    Builders<ETLSpec>.IndexKeys.Ascending(x => x.BusinessDomain),
                    new CreateIndexOptions { Name = "BusinessDomain_1" }
                );
                _collection.Indexes.CreateOne(businessDomainIndexModel);
            }

            // Create compound index on ClientId and BusinessDomain
            if (!indexNames.Contains("ClientId_BusinessDomain_compound"))
            {
                var compoundIndexModel = new CreateIndexModel<ETLSpec>(
                    Builders<ETLSpec>.IndexKeys.Combine(
                        Builders<ETLSpec>.IndexKeys.Ascending(x => x.ClientId),
                        Builders<ETLSpec>.IndexKeys.Ascending(x => x.BusinessDomain)
                    ),
                    new CreateIndexOptions { Name = "ClientId_BusinessDomain_compound" }
                );
                _collection.Indexes.CreateOne(compoundIndexModel);
            }

            // Create index on IsActive for filtering
            if (!indexNames.Contains("IsActive_1"))
            {
                var isActiveIndexModel = new CreateIndexModel<ETLSpec>(
                    Builders<ETLSpec>.IndexKeys.Ascending(x => x.IsActive),
                    new CreateIndexOptions { Name = "IsActive_1" }
                );
                _collection.Indexes.CreateOne(isActiveIndexModel);
            }

            _logger.LogInformation("MongoDB indexes checked and created successfully");
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to create some indexes. This might be expected if they already exist.");
        }
    }

    public async Task<ETLSpec?> GetByIdAsync(string id)
    {
        try
        {
            var filter = Builders<ETLSpec>.Filter.Eq(x => x.Id, id);
            return await _collection.Find(filter).FirstOrDefaultAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving ETL specification by id: {Id}", id);
            throw;
        }
    }

    public async Task<ETLSpec?> GetByClientIdAsync(string clientId)
    {
        try
        {
            var filter = Builders<ETLSpec>.Filter.Eq(x => x.ClientId, clientId);
            return await _collection.Find(filter).FirstOrDefaultAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving ETL specification by client id: {ClientId}", clientId);
            throw;
        }
    }

    public async Task<IEnumerable<ETLSpec>> GetAllAsync()
    {
        try
        {
            var filter = Builders<ETLSpec>.Filter.Eq(x => x.IsActive, true);
            return await _collection.Find(filter).ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all ETL specifications");
            throw;
        }
    }

    public async Task<IEnumerable<ETLSpec>> GetByBusinessDomainAsync(string businessDomain)
    {
        try
        {
            var filter = Builders<ETLSpec>.Filter.And(
                Builders<ETLSpec>.Filter.Eq(x => x.BusinessDomain, businessDomain),
                Builders<ETLSpec>.Filter.Eq(x => x.IsActive, true)
            );
            return await _collection.Find(filter).ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving ETL specifications by business domain: {BusinessDomain}", businessDomain);
            throw;
        }
    }

    public async Task<IEnumerable<ETLSpec>> GetByClientIdAndDomainAsync(string clientId, string businessDomain)
    {
        try
        {
            var filter = Builders<ETLSpec>.Filter.And(
                Builders<ETLSpec>.Filter.Eq(x => x.ClientId, clientId),
                Builders<ETLSpec>.Filter.Eq(x => x.BusinessDomain, businessDomain),
                Builders<ETLSpec>.Filter.Eq(x => x.IsActive, true)
            );
            return await _collection.Find(filter).ToListAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving ETL specifications by client id and business domain: {ClientId}, {BusinessDomain}", clientId, businessDomain);
            throw;
        }
    }    public async Task<ETLSpec> CreateAsync(ETLSpec specification)
    {
        try
        {
            // Check if an active specification already exists for this client
            var existsActive = await ExistsByClientIdAsync(specification.ClientId);
            if (existsActive)
            {
                throw new InvalidOperationException($"ETL specification already exists for client {specification.ClientId}");
            }

            await _collection.InsertOneAsync(specification);
            _logger.LogInformation("Created ETL specification with id: {Id} for client: {ClientId}", specification.Id, specification.ClientId);
            return specification;
        }
        catch (InvalidOperationException)
        {
            // Re-throw our custom exception
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating ETL specification for client: {ClientId}", specification.ClientId);
            throw;
        }
    }

    public async Task<ETLSpec> UpdateAsync(ETLSpec specification)
    {
        try
        {
            var filter = Builders<ETLSpec>.Filter.Eq(x => x.Id, specification.Id);
            var update = Builders<ETLSpec>.Update
                .Set(x => x.BusinessDomain, specification.BusinessDomain)
                .Set(x => x.PythonNotebookIds, specification.PythonNotebookIds)
                .Set(x => x.Metadata, specification.Metadata)
                .Set(x => x.Schema, specification.Schema)
                .Set(x => x.ValidationRules, specification.ValidationRules)
                .Set(x => x.Constants, specification.Constants)
                .Set(x => x.BusinessRules, specification.BusinessRules)
                .Set(x => x.OutputSchema, specification.OutputSchema)
                .Set(x => x.UpdatedAt, specification.UpdatedAt)
                .Set(x => x.UpdatedBy, specification.UpdatedBy)
                .Set(x => x.Version, specification.Version);

            var result = await _collection.ReplaceOneAsync(filter, specification);

            if (result.ModifiedCount == 0)
            {
                throw new KeyNotFoundException($"ETL specification with id {specification.Id} not found");
            }

            _logger.LogInformation("Updated ETL specification with id: {Id}", specification.Id);
            return specification;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating ETL specification with id: {Id}", specification.Id);
            throw;
        }
    }

    public async Task<bool> DeleteAsync(string id)
    {
        try
        {
            var filter = Builders<ETLSpec>.Filter.Eq(x => x.Id, id);
            var update = Builders<ETLSpec>.Update
                .Set(x => x.IsActive, false)
                .Set(x => x.UpdatedAt, DateTime.UtcNow);

            var result = await _collection.UpdateOneAsync(filter, update);

            if (result.ModifiedCount > 0)
            {
                _logger.LogInformation("Soft deleted ETL specification with id: {Id}", id);
                return true;
            }

            return false;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting ETL specification with id: {Id}", id);
            throw;
        }
    }

    public async Task<bool> ExistsAsync(string id)
    {
        try
        {
            var filter = Builders<ETLSpec>.Filter.Eq(x => x.Id, id);
            return await _collection.Find(filter).AnyAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking existence of ETL specification with id: {Id}", id);
            throw;
        }
    }    public async Task<bool> ExistsByClientIdAsync(string clientId)
    {
        try
        {
            var filter = Builders<ETLSpec>.Filter.And(
                Builders<ETLSpec>.Filter.Eq(x => x.ClientId, clientId),
                Builders<ETLSpec>.Filter.Eq(x => x.IsActive, true)
            );
            return await _collection.Find(filter).AnyAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking existence of ETL specification by client id: {ClientId}", clientId);
            throw;
        }
    }
}