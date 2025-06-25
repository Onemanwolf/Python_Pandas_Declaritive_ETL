using ETLSpecification.Application.DTOs;

namespace ETLSpecification.Application.Services;

public interface IETLSpecificationService
{
    Task<ETLSpecificationDto?> GetByIdAsync(string id);
    Task<ETLSpecificationDto?> GetByClientIdAsync(string clientId);
    Task<IEnumerable<ETLSpecificationSummaryDto>> GetAllAsync();
    Task<IEnumerable<ETLSpecificationSummaryDto>> GetByBusinessDomainAsync(string businessDomain);
    Task<IEnumerable<ETLSpecificationSummaryDto>> GetByClientIdAndDomainAsync(string clientId, string businessDomain);
    Task<ETLSpecificationDto> CreateAsync(CreateETLSpecificationDto createDto);
    Task<ETLSpecificationDto> UpdateAsync(string id, UpdateETLSpecificationDto updateDto);
    Task<bool> DeleteAsync(string id);
    Task<ValidationResultDto> ValidateSpecificationAsync(ETLSpecificationDto specification);
    Task<ValidationResultDto> ValidateSpecificationByIdAsync(string id);
    Task<string> ExportToJsonAsync(string id);
    Task<ETLSpecificationDto> ImportFromJsonAsync(string jsonContent, string clientId, string createdBy);
}