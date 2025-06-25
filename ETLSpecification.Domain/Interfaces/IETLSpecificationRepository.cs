using ETLSpecification.Domain.Models;
using ETLSpec = ETLSpecification.Domain.Models.ETLSpecification;

namespace ETLSpecification.Domain.Interfaces;

public interface IETLSpecificationRepository
{
    Task<ETLSpec?> GetByIdAsync(string id);
    Task<ETLSpec?> GetByClientIdAsync(string clientId);
    Task<IEnumerable<ETLSpec>> GetAllAsync();
    Task<IEnumerable<ETLSpec>> GetByBusinessDomainAsync(string businessDomain);
    Task<IEnumerable<ETLSpec>> GetByClientIdAndDomainAsync(string clientId, string businessDomain);
    Task<ETLSpec> CreateAsync(ETLSpec specification);
    Task<ETLSpec> UpdateAsync(ETLSpec specification);
    Task<bool> DeleteAsync(string id);
    Task<bool> ExistsAsync(string id);
    Task<bool> ExistsByClientIdAsync(string clientId);
}