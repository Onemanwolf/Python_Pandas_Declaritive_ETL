using AutoMapper;
using ETLSpecification.Application.DTOs;
using ETLSpecification.Domain.Models;
using ETLSpecification.Domain.Interfaces;
using ETLSpecification.Domain.Validators;
using FluentValidation;
using System.Text.Json;
using ETLSpec = ETLSpecification.Domain.Models.ETLSpecification;

namespace ETLSpecification.Application.Services;

public class ETLSpecificationService : IETLSpecificationService
{
    private readonly IETLSpecificationRepository _repository;
    private readonly IMapper _mapper;
    private readonly ETLSpecificationValidator _validator;

    public ETLSpecificationService(
        IETLSpecificationRepository repository,
        IMapper mapper,
        ETLSpecificationValidator validator)
    {
        _repository = repository;
        _mapper = mapper;
        _validator = validator;
    }

    public async Task<ETLSpecificationDto?> GetByIdAsync(string id)
    {
        var specification = await _repository.GetByIdAsync(id);
        return _mapper.Map<ETLSpecificationDto>(specification);
    }

    public async Task<ETLSpecificationDto?> GetByClientIdAsync(string clientId)
    {
        var specification = await _repository.GetByClientIdAsync(clientId);
        return _mapper.Map<ETLSpecificationDto>(specification);
    }

    public async Task<IEnumerable<ETLSpecificationSummaryDto>> GetAllAsync()
    {
        var specifications = await _repository.GetAllAsync();
        return _mapper.Map<IEnumerable<ETLSpecificationSummaryDto>>(specifications);
    }

    public async Task<IEnumerable<ETLSpecificationSummaryDto>> GetByBusinessDomainAsync(string businessDomain)
    {
        var specifications = await _repository.GetByBusinessDomainAsync(businessDomain);
        return _mapper.Map<IEnumerable<ETLSpecificationSummaryDto>>(specifications);
    }

    public async Task<IEnumerable<ETLSpecificationSummaryDto>> GetByClientIdAndDomainAsync(string clientId, string businessDomain)
    {
        var specifications = await _repository.GetByClientIdAndDomainAsync(clientId, businessDomain);
        return _mapper.Map<IEnumerable<ETLSpecificationSummaryDto>>(specifications);
    }

    public async Task<ETLSpecificationDto> CreateAsync(CreateETLSpecificationDto createDto)
    {
        // Check if specification already exists for this client
        if (await _repository.ExistsByClientIdAsync(createDto.ClientId))
        {
            throw new ValidationException($"ETL specification already exists for client {createDto.ClientId}");
        }

        var specification = _mapper.Map<ETLSpec>(createDto);

        // Set initial values
        specification.Id = Guid.NewGuid().ToString();
        specification.CreatedAt = DateTime.UtcNow;
        specification.UpdatedAt = DateTime.UtcNow;
        specification.IsActive = true;
        specification.Version = 1;

        // Validate specification
        var validationResult = await _validator.ValidateAsync(specification);
        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        var createdSpecification = await _repository.CreateAsync(specification);
        return _mapper.Map<ETLSpecificationDto>(createdSpecification);
    }

    public async Task<ETLSpecificationDto> UpdateAsync(string id, UpdateETLSpecificationDto updateDto)
    {
        var existingSpecification = await _repository.GetByIdAsync(id);
        if (existingSpecification == null)
        {
            throw new KeyNotFoundException($"ETL specification with id {id} not found");
        }

        // Update properties
        existingSpecification.BusinessDomain = updateDto.BusinessDomain;
        existingSpecification.PythonNotebookIds = updateDto.PythonNotebookIds;
        existingSpecification.Metadata = _mapper.Map<Metadata>(updateDto.Metadata);
        existingSpecification.Schema = _mapper.Map<Schema>(updateDto.Schema);
        existingSpecification.ValidationRules = _mapper.Map<List<ValidationRule>>(updateDto.ValidationRules);
        existingSpecification.Constants = updateDto.Constants;
        existingSpecification.BusinessRules = _mapper.Map<List<BusinessRule>>(updateDto.BusinessRules);
        existingSpecification.OutputSchema = _mapper.Map<OutputSchema>(updateDto.OutputSchema);
        existingSpecification.UpdatedAt = DateTime.UtcNow;
        existingSpecification.UpdatedBy = updateDto.UpdatedBy;
        existingSpecification.Version++;

        // Validate updated specification
        var validationResult = await _validator.ValidateAsync(existingSpecification);
        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }

        var updatedSpecification = await _repository.UpdateAsync(existingSpecification);
        return _mapper.Map<ETLSpecificationDto>(updatedSpecification);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var specification = await _repository.GetByIdAsync(id);
        if (specification == null)
        {
            return false;
        }

        return await _repository.DeleteAsync(id);
    }

    public async Task<ValidationResultDto> ValidateSpecificationAsync(ETLSpecificationDto specification)
    {
        var domainSpecification = _mapper.Map<ETLSpec>(specification);
        var validationResult = await _validator.ValidateAsync(domainSpecification);

        return new ValidationResultDto
        {
            IsValid = validationResult.IsValid,
            Errors = validationResult.Errors.Select(e => e.ErrorMessage).ToList(),
            Warnings = new List<string>() // Could add warnings logic here
        };
    }

    public async Task<ValidationResultDto> ValidateSpecificationByIdAsync(string id)
    {
        var specification = await _repository.GetByIdAsync(id);
        if (specification == null)
        {
            return new ValidationResultDto
            {
                IsValid = false,
                Errors = new List<string> { $"ETL specification with id {id} not found" }
            };
        }

        var specificationDto = _mapper.Map<ETLSpecificationDto>(specification);
        return await ValidateSpecificationAsync(specificationDto);
    }

    public async Task<string> ExportToJsonAsync(string id)
    {
        var specification = await _repository.GetByIdAsync(id);
        if (specification == null)
        {
            throw new KeyNotFoundException($"ETL specification with id {id} not found");
        }

        // Create export object without internal fields
        var exportObject = new
        {
            metadata = specification.Metadata,
            schema = specification.Schema,
            validation_rules = specification.ValidationRules,
            constants = specification.Constants,
            business_rules = specification.BusinessRules,
            output_schema = specification.OutputSchema
        };

        var options = new JsonSerializerOptions
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
        };

        return JsonSerializer.Serialize(exportObject, options);
    }

    public async Task<ETLSpecificationDto> ImportFromJsonAsync(string jsonContent, string clientId, string createdBy)
    {
        try
        {
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower
            };

            var importData = JsonSerializer.Deserialize<JsonElement>(jsonContent, options);

            // Create specification from JSON
            var specification = new ETLSpec
            {
                Id = Guid.NewGuid().ToString(),
                ClientId = clientId,
                BusinessDomain = "Imported", // Default value, should be updated
                Metadata = JsonSerializer.Deserialize<Metadata>(importData.GetProperty("metadata").GetRawText(), options)!,
                Schema = JsonSerializer.Deserialize<Schema>(importData.GetProperty("schema").GetRawText(), options)!,
                ValidationRules = JsonSerializer.Deserialize<List<ValidationRule>>(importData.GetProperty("validation_rules").GetRawText(), options)!,
                Constants = JsonSerializer.Deserialize<Dictionary<string, object>>(importData.GetProperty("constants").GetRawText(), options)!,
                BusinessRules = JsonSerializer.Deserialize<List<BusinessRule>>(importData.GetProperty("business_rules").GetRawText(), options)!,
                OutputSchema = JsonSerializer.Deserialize<OutputSchema>(importData.GetProperty("output_schema").GetRawText(), options)!,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                CreatedBy = createdBy,
                UpdatedBy = createdBy,
                IsActive = true,
                Version = 1
            };

            // Validate imported specification
            var validationResult = await _validator.ValidateAsync(specification);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }

            var createdSpecification = await _repository.CreateAsync(specification);
            return _mapper.Map<ETLSpecificationDto>(createdSpecification);
        }
        catch (JsonException ex)
        {
            throw new ValidationException($"Invalid JSON format: {ex.Message}");
        }
    }
}