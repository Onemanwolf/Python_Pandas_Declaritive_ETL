namespace ETLSpecification.Application.DTOs;

public class ETLSpecificationDto
{
    public string Id { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public string BusinessDomain { get; set; } = string.Empty;
    public List<string> PythonNotebookIds { get; set; } = new();
    public MetadataDto Metadata { get; set; } = new();
    public SchemaDto Schema { get; set; } = new();
    public List<ValidationRuleDto> ValidationRules { get; set; } = new();
    public Dictionary<string, object> Constants { get; set; } = new();
    public List<BusinessRuleDto> BusinessRules { get; set; } = new();
    public OutputSchemaDto OutputSchema { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public string UpdatedBy { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public int Version { get; set; }
}

public class CreateETLSpecificationDto
{
    public string ClientId { get; set; } = string.Empty;
    public string BusinessDomain { get; set; } = string.Empty;
    public List<string> PythonNotebookIds { get; set; } = new();
    public MetadataDto Metadata { get; set; } = new();
    public SchemaDto Schema { get; set; } = new();
    public List<ValidationRuleDto> ValidationRules { get; set; } = new();
    public Dictionary<string, object> Constants { get; set; } = new();
    public List<BusinessRuleDto> BusinessRules { get; set; } = new();
    public OutputSchemaDto OutputSchema { get; set; } = new();
    public string CreatedBy { get; set; } = string.Empty;
}

public class UpdateETLSpecificationDto
{
    public string BusinessDomain { get; set; } = string.Empty;
    public List<string> PythonNotebookIds { get; set; } = new();
    public MetadataDto Metadata { get; set; } = new();
    public SchemaDto Schema { get; set; } = new();
    public List<ValidationRuleDto> ValidationRules { get; set; } = new();
    public Dictionary<string, object> Constants { get; set; } = new();
    public List<BusinessRuleDto> BusinessRules { get; set; } = new();
    public OutputSchemaDto OutputSchema { get; set; } = new();
    public string UpdatedBy { get; set; } = string.Empty;
}

public class MetadataDto
{
    public string Name { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public string Author { get; set; } = string.Empty;
}

public class SchemaDto
{
    public List<string> RequiredColumns { get; set; } = new();
    public Dictionary<string, string> DataTypes { get; set; } = new();
}

public class ValidationRuleDto
{
    public string Column { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Dictionary<string, object> Parameters { get; set; } = new();
}

public class BusinessRuleDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Formula { get; set; } = string.Empty;
    public List<string> Dependencies { get; set; } = new();
    public string OutputColumn { get; set; } = string.Empty;
}

public class OutputSchemaDto
{
    public List<string> RequiredColumns { get; set; } = new();
    public List<string> OptionalColumns { get; set; } = new();
}

public class ETLSpecificationSummaryDto
{
    public string Id { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public string BusinessDomain { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsActive { get; set; }
}

public class ValidationResultDto
{
    public bool IsValid { get; set; }
    public List<string> Errors { get; set; } = new();
    public List<string> Warnings { get; set; } = new();
}