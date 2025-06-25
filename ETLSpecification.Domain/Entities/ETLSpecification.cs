using System.ComponentModel.DataAnnotations;

namespace ETLSpecification.Domain.Models;

public class ETLSpecification
{
    public string Id { get; set; } = string.Empty;

    [Required]
    public string ClientId { get; set; } = string.Empty;

    [Required]
    public string BusinessDomain { get; set; } = string.Empty;

    public List<string> PythonNotebookIds { get; set; } = new();

    [Required]
    public Metadata Metadata { get; set; } = new();

    [Required]
    public Schema Schema { get; set; } = new();

    [Required]
    public List<ValidationRule> ValidationRules { get; set; } = new();

    [Required]
    public Dictionary<string, object> Constants { get; set; } = new();

    [Required]
    public List<BusinessRule> BusinessRules { get; set; } = new();

    [Required]
    public OutputSchema OutputSchema { get; set; } = new();

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public string CreatedBy { get; set; } = string.Empty;
    public string UpdatedBy { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public int Version { get; set; } = 1;
}

public class Metadata
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Version { get; set; } = "1.0";

    public string Description { get; set; } = string.Empty;

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    public string Author { get; set; } = string.Empty;
}

public class Schema
{
    [Required]
    public List<string> RequiredColumns { get; set; } = new();

    [Required]
    public Dictionary<string, string> DataTypes { get; set; } = new();
}

public class ValidationRule
{
    [Required]
    public string Column { get; set; } = string.Empty;

    [Required]
    public string Type { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public Dictionary<string, object> Parameters { get; set; } = new();
}

public class BusinessRule
{
    [Required]
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    [Required]
    public string Formula { get; set; } = string.Empty;

    public List<string> Dependencies { get; set; } = new();

    [Required]
    public string OutputColumn { get; set; } = string.Empty;
}

public class OutputSchema
{
    [Required]
    public List<string> RequiredColumns { get; set; } = new();

    public List<string> OptionalColumns { get; set; } = new();
}