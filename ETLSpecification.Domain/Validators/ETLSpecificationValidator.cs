using FluentValidation;
using ETLSpecification.Domain.Models;
using ETLSpec = ETLSpecification.Domain.Models.ETLSpecification;

namespace ETLSpecification.Domain.Validators;

public class ETLSpecificationValidator : AbstractValidator<ETLSpec>
{
    public ETLSpecificationValidator()
    {
        RuleFor(x => x.ClientId)
            .NotEmpty()
            .WithMessage("ClientId is required")
            .MaximumLength(100)
            .WithMessage("ClientId cannot exceed 100 characters");

        RuleFor(x => x.BusinessDomain)
            .NotEmpty()
            .WithMessage("BusinessDomain is required")
            .MaximumLength(200)
            .WithMessage("BusinessDomain cannot exceed 200 characters");

        RuleFor(x => x.Metadata)
            .SetValidator(new MetadataValidator());

        RuleFor(x => x.Schema)
            .SetValidator(new SchemaValidator());

        RuleFor(x => x.ValidationRules)
            .NotEmpty()
            .WithMessage("At least one validation rule is required");

        RuleForEach(x => x.ValidationRules)
            .SetValidator(new ValidationRuleValidator());

        RuleFor(x => x.Constants)
            .NotEmpty()
            .WithMessage("At least one constant is required");

        RuleFor(x => x.BusinessRules)
            .NotEmpty()
            .WithMessage("At least one business rule is required");

        RuleForEach(x => x.BusinessRules)
            .SetValidator(new BusinessRuleValidator());

        RuleFor(x => x.OutputSchema)
            .SetValidator(new OutputSchemaValidator());

        // Cross-property validation
        RuleFor(x => x)
            .Must(HaveValidBusinessRuleDependencies)
            .WithMessage("Business rule dependencies must reference existing columns or calculated fields");

        RuleFor(x => x)
            .Must(HaveValidOutputSchemaColumns)
            .WithMessage("Output schema columns must be defined in business rules or schema");
    }

    private bool HaveValidBusinessRuleDependencies(ETLSpec specification)
    {
        var availableColumns = specification.Schema.RequiredColumns.ToHashSet();
        var calculatedColumns = specification.BusinessRules.Select(br => br.OutputColumn).ToHashSet();
        availableColumns.UnionWith(calculatedColumns);

        return specification.BusinessRules.All(br =>
            br.Dependencies.All(dep => availableColumns.Contains(dep)));
    }

    private bool HaveValidOutputSchemaColumns(ETLSpec specification)
    {
        var availableColumns = specification.Schema.RequiredColumns.ToHashSet();
        var calculatedColumns = specification.BusinessRules.Select(br => br.OutputColumn).ToHashSet();
        availableColumns.UnionWith(calculatedColumns);

        var allOutputColumns = specification.OutputSchema.RequiredColumns
            .Union(specification.OutputSchema.OptionalColumns);

        return allOutputColumns.All(col => availableColumns.Contains(col));
    }
}

public class MetadataValidator : AbstractValidator<Metadata>
{
    public MetadataValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Name is required")
            .MaximumLength(200)
            .WithMessage("Name cannot exceed 200 characters");

        RuleFor(x => x.Version)
            .NotEmpty()
            .WithMessage("Version is required")
            .Matches(@"^\d+\.\d+(\.\d+)?$")
            .WithMessage("Version must be in format X.Y or X.Y.Z");

        RuleFor(x => x.Author)
            .MaximumLength(100)
            .WithMessage("Author cannot exceed 100 characters");
    }
}

public class SchemaValidator : AbstractValidator<Schema>
{
    public SchemaValidator()
    {
        RuleFor(x => x.RequiredColumns)
            .NotEmpty()
            .WithMessage("At least one required column is needed");

        RuleForEach(x => x.RequiredColumns)
            .NotEmpty()
            .WithMessage("Column name cannot be empty")
            .Matches(@"^[a-zA-Z_][a-zA-Z0-9_]*$")
            .WithMessage("Column name must be a valid identifier");

        RuleFor(x => x.DataTypes)
            .NotEmpty()
            .WithMessage("Data types must be defined");

        RuleFor(x => x)
            .Must(HaveMatchingDataTypes)
            .WithMessage("All required columns must have corresponding data types");
    }

    private bool HaveMatchingDataTypes(Schema schema)
    {
        return schema.RequiredColumns.All(col => schema.DataTypes.ContainsKey(col));
    }
}

public class ValidationRuleValidator : AbstractValidator<ValidationRule>
{
    public ValidationRuleValidator()
    {
        RuleFor(x => x.Column)
            .NotEmpty()
            .WithMessage("Column name is required");

        RuleFor(x => x.Type)
            .NotEmpty()
            .WithMessage("Validation type is required")
            .Must(BeValidValidationType)
            .WithMessage("Validation type must be one of: not_null, unique, range, custom");

        RuleFor(x => x.Description)
            .MaximumLength(500)
            .WithMessage("Description cannot exceed 500 characters");

        When(x => x.Type == "range", () =>
        {
            RuleFor(x => x.Parameters)
                .Must(HaveRangeParameters)
                .WithMessage("Range validation requires 'min' and/or 'max' parameters");
        });
    }

    private bool BeValidValidationType(string type)
    {
        return new[] { "not_null", "unique", "range", "custom" }.Contains(type);
    }

    private bool HaveRangeParameters(Dictionary<string, object> parameters)
    {
        return parameters.ContainsKey("min") || parameters.ContainsKey("max");
    }
}

public class BusinessRuleValidator : AbstractValidator<BusinessRule>
{
    public BusinessRuleValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Business rule name is required")
            .Matches(@"^[a-zA-Z_][a-zA-Z0-9_]*$")
            .WithMessage("Business rule name must be a valid identifier");

        RuleFor(x => x.Formula)
            .NotEmpty()
            .WithMessage("Formula is required")
            .Must(BeValidFormula)
            .WithMessage("Formula must be a valid pandas expression");

        RuleFor(x => x.OutputColumn)
            .NotEmpty()
            .WithMessage("Output column is required")
            .Matches(@"^[a-zA-Z_][a-zA-Z0-9_]*$")
            .WithMessage("Output column must be a valid identifier");

        RuleFor(x => x.Description)
            .MaximumLength(500)
            .WithMessage("Description cannot exceed 500 characters");
    }

    private bool BeValidFormula(string formula)
    {
        if (string.IsNullOrWhiteSpace(formula))
            return false;

        // Basic validation for pandas formula structure
        var hasDataFrameReference = formula.Contains("df[");
        var hasValidOperators = formula.Contains("+") || formula.Contains("-") ||
                               formula.Contains("*") || formula.Contains("/") ||
                               formula.Contains("np.") || formula.Contains("pd.");

        return hasDataFrameReference || hasValidOperators;
    }
}

public class OutputSchemaValidator : AbstractValidator<OutputSchema>
{
    public OutputSchemaValidator()
    {
        RuleFor(x => x.RequiredColumns)
            .NotEmpty()
            .WithMessage("At least one required output column is needed");

        RuleForEach(x => x.RequiredColumns)
            .NotEmpty()
            .WithMessage("Required column name cannot be empty")
            .Matches(@"^[a-zA-Z_][a-zA-Z0-9_]*$")
            .WithMessage("Required column name must be a valid identifier");

        RuleForEach(x => x.OptionalColumns)
            .NotEmpty()
            .WithMessage("Optional column name cannot be empty")
            .Matches(@"^[a-zA-Z_][a-zA-Z0-9_]*$")
            .WithMessage("Optional column name must be a valid identifier");

        RuleFor(x => x)
            .Must(HaveUniqueColumns)
            .WithMessage("Required and optional columns must be unique");
    }

    private bool HaveUniqueColumns(OutputSchema schema)
    {
        var allColumns = schema.RequiredColumns.Union(schema.OptionalColumns).ToList();
        return allColumns.Count == allColumns.Distinct().Count();
    }
}