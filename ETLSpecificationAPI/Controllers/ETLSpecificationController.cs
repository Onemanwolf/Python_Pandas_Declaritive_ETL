using ETLSpecification.Application.DTOs;
using ETLSpecification.Application.Services;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace ETLSpecificationAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ETLSpecificationController : ControllerBase
{
    private readonly IETLSpecificationService _service;
    private readonly ILogger<ETLSpecificationController> _logger;

    public ETLSpecificationController(IETLSpecificationService service, ILogger<ETLSpecificationController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Get all ETL specifications
    /// </summary>
    /// <returns>List of ETL specification summaries</returns>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ETLSpecificationSummaryDto>), 200)]
    [ProducesResponseType(500)]
    public async Task<ActionResult<IEnumerable<ETLSpecificationSummaryDto>>> GetAll()
    {
        try
        {
            var specifications = await _service.GetAllAsync();
            return Ok(specifications);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving all ETL specifications");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Get ETL specification by ID
    /// </summary>
    /// <param name="id">The specification ID</param>
    /// <returns>ETL specification details</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ETLSpecificationDto), 200)]
    [ProducesResponseType(404)]
    [ProducesResponseType(500)]
    public async Task<ActionResult<ETLSpecificationDto>> GetById(string id)
    {
        try
        {
            var specification = await _service.GetByIdAsync(id);
            if (specification == null)
            {
                return NotFound(new { error = $"ETL specification with id {id} not found" });
            }

            return Ok(specification);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving ETL specification with id: {Id}", id);
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Get ETL specification by Client ID
    /// </summary>
    /// <param name="clientId">The client ID</param>
    /// <returns>ETL specification details</returns>
    [HttpGet("client/{clientId}")]
    [ProducesResponseType(typeof(ETLSpecificationDto), 200)]
    [ProducesResponseType(404)]
    [ProducesResponseType(500)]
    public async Task<ActionResult<ETLSpecificationDto>> GetByClientId(string clientId)
    {
        try
        {
            var specification = await _service.GetByClientIdAsync(clientId);
            if (specification == null)
            {
                return NotFound(new { error = $"ETL specification for client {clientId} not found" });
            }

            return Ok(specification);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving ETL specification for client: {ClientId}", clientId);
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Get ETL specifications by business domain
    /// </summary>
    /// <param name="businessDomain">The business domain</param>
    /// <returns>List of ETL specification summaries</returns>
    [HttpGet("domain/{businessDomain}")]
    [ProducesResponseType(typeof(IEnumerable<ETLSpecificationSummaryDto>), 200)]
    [ProducesResponseType(500)]
    public async Task<ActionResult<IEnumerable<ETLSpecificationSummaryDto>>> GetByBusinessDomain(string businessDomain)
    {
        try
        {
            var specifications = await _service.GetByBusinessDomainAsync(businessDomain);
            return Ok(specifications);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving ETL specifications for business domain: {BusinessDomain}", businessDomain);
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Get ETL specifications by client ID and business domain
    /// </summary>
    /// <param name="clientId">The client ID</param>
    /// <param name="businessDomain">The business domain</param>
    /// <returns>List of ETL specification summaries</returns>
    [HttpGet("client/{clientId}/domain/{businessDomain}")]
    [ProducesResponseType(typeof(IEnumerable<ETLSpecificationSummaryDto>), 200)]
    [ProducesResponseType(500)]
    public async Task<ActionResult<IEnumerable<ETLSpecificationSummaryDto>>> GetByClientIdAndDomain(string clientId, string businessDomain)
    {
        try
        {
            var specifications = await _service.GetByClientIdAndDomainAsync(clientId, businessDomain);
            return Ok(specifications);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving ETL specifications for client {ClientId} and business domain {BusinessDomain}", clientId, businessDomain);
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Create a new ETL specification
    /// </summary>
    /// <param name="createDto">The ETL specification to create</param>
    /// <returns>Created ETL specification</returns>
    [HttpPost]
    [ProducesResponseType(typeof(ETLSpecificationDto), 201)]
    [ProducesResponseType(400)]
    [ProducesResponseType(409)]
    [ProducesResponseType(500)]
    public async Task<ActionResult<ETLSpecificationDto>> Create([FromBody] CreateETLSpecificationDto createDto)
    {
        try
        {
            var specification = await _service.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = specification.Id }, specification);
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning(ex, "Validation error creating ETL specification for client: {ClientId}", createDto.ClientId);
            return BadRequest(new { error = "Validation error", details = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Business rule violation creating ETL specification for client: {ClientId}", createDto.ClientId);
            return Conflict(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating ETL specification for client: {ClientId}", createDto.ClientId);
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Update an existing ETL specification
    /// </summary>
    /// <param name="id">The specification ID</param>
    /// <param name="updateDto">The updated ETL specification</param>
    /// <returns>Updated ETL specification</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ETLSpecificationDto), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    [ProducesResponseType(500)]
    public async Task<ActionResult<ETLSpecificationDto>> Update(string id, [FromBody] UpdateETLSpecificationDto updateDto)
    {
        try
        {
            var specification = await _service.UpdateAsync(id, updateDto);
            return Ok(specification);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "ETL specification not found for update: {Id}", id);
            return NotFound(new { error = ex.Message });
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning(ex, "Validation error updating ETL specification: {Id}", id);
            return BadRequest(new { error = "Validation error", details = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating ETL specification: {Id}", id);
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Delete an ETL specification
    /// </summary>
    /// <param name="id">The specification ID</param>
    /// <returns>Success status</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    [ProducesResponseType(500)]
    public async Task<ActionResult> Delete(string id)
    {
        try
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted)
            {
                return NotFound(new { error = $"ETL specification with id {id} not found" });
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting ETL specification: {Id}", id);
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Validate an ETL specification
    /// </summary>
    /// <param name="specification">The ETL specification to validate</param>
    /// <returns>Validation result</returns>
    [HttpPost("validate")]
    [ProducesResponseType(typeof(ValidationResultDto), 200)]
    [ProducesResponseType(500)]
    public async Task<ActionResult<ValidationResultDto>> Validate([FromBody] ETLSpecificationDto specification)
    {
        try
        {
            var result = await _service.ValidateSpecificationAsync(specification);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating ETL specification");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Validate an ETL specification by ID
    /// </summary>
    /// <param name="id">The specification ID</param>
    /// <returns>Validation result</returns>
    [HttpGet("{id}/validate")]
    [ProducesResponseType(typeof(ValidationResultDto), 200)]
    [ProducesResponseType(404)]
    [ProducesResponseType(500)]
    public async Task<ActionResult<ValidationResultDto>> ValidateById(string id)
    {
        try
        {
            var result = await _service.ValidateSpecificationByIdAsync(id);
            if (!result.IsValid && result.Errors.Contains($"ETL specification with id {id} not found"))
            {
                return NotFound(new { error = $"ETL specification with id {id} not found" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating ETL specification: {Id}", id);
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Export ETL specification to JSON
    /// </summary>
    /// <param name="id">The specification ID</param>
    /// <returns>JSON content</returns>
    [HttpGet("{id}/export")]
    [ProducesResponseType(typeof(string), 200)]
    [ProducesResponseType(404)]
    [ProducesResponseType(500)]
    public async Task<ActionResult<string>> ExportToJson(string id)
    {
        try
        {
            var jsonContent = await _service.ExportToJsonAsync(id);
            return Ok(jsonContent);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "ETL specification not found for export: {Id}", id);
            return NotFound(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error exporting ETL specification: {Id}", id);
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    /// <summary>
    /// Import ETL specification from JSON
    /// </summary>
    /// <param name="importRequest">Import request containing JSON content and metadata</param>
    /// <returns>Created ETL specification</returns>
    [HttpPost("import")]
    [ProducesResponseType(typeof(ETLSpecificationDto), 201)]
    [ProducesResponseType(400)]
    [ProducesResponseType(500)]
    public async Task<ActionResult<ETLSpecificationDto>> ImportFromJson([FromBody] ImportRequestDto importRequest)
    {
        try
        {
            var specification = await _service.ImportFromJsonAsync(importRequest.JsonContent, importRequest.ClientId, importRequest.CreatedBy);
            return CreatedAtAction(nameof(GetById), new { id = specification.Id }, specification);
        }
        catch (ValidationException ex)
        {
            _logger.LogWarning(ex, "Validation error importing ETL specification for client: {ClientId}", importRequest.ClientId);
            return BadRequest(new { error = "Validation error", details = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error importing ETL specification for client: {ClientId}", importRequest.ClientId);
            return StatusCode(500, new { error = "Internal server error" });
        }
    }
}

public class ImportRequestDto
{
    [Required]
    public string JsonContent { get; set; } = string.Empty;

    [Required]
    public string ClientId { get; set; } = string.Empty;

    [Required]
    public string CreatedBy { get; set; } = string.Empty;
}