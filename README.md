# ETL Specification Web API

A .NET 8 Web API for managing ETL (Extract, Transform, Load) specifications with MongoDB storage, following Clean Architecture and Domain-Driven Design principles.

## Architecture Overview

The solution follows Clean Architecture with the following layers:

- **Domain Layer**: Core entities, interfaces, and validation rules
- **Application Layer**: Business logic, services, and DTOs
- **Infrastructure Layer**: Data access, MongoDB repository implementation
- **Web API Layer**: Controllers and API endpoints

## Features

- ✅ CRUD operations for ETL specifications
- ✅ Comprehensive validation using FluentValidation
- ✅ MongoDB storage with optimized indexes
- ✅ JSON import/export functionality
- ✅ Business rule validation
- ✅ Client and domain-based filtering
- ✅ Swagger/OpenAPI documentation
- ✅ Clean Architecture implementation
- ✅ Domain-Driven Design principles

## Prerequisites

- .NET 8 SDK
- MongoDB (local or cloud instance)
- Visual Studio 2022 or VS Code

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ETLSpecificationAPI
```

### 2. Configure MongoDB

Update the MongoDB connection string in `appsettings.json`:

```json
{
  "MongoDB": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "ETLSpecifications",
    "CollectionName": "Specifications"
  }
}
```

### 3. Build and Run

```bash
# Restore packages
dotnet restore

# Build the solution
dotnet build

# Run the API
dotnet run --project ETLSpecificationAPI
```

The API will be available at:
- **API**: https://localhost:7001
- **Swagger UI**: https://localhost:7001/swagger

## API Endpoints

### ETL Specifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ETLSpecification` | Get all ETL specifications |
| GET | `/api/ETLSpecification/{id}` | Get specification by ID |
| GET | `/api/ETLSpecification/client/{clientId}` | Get specification by Client ID |
| GET | `/api/ETLSpecification/domain/{businessDomain}` | Get specifications by business domain |
| GET | `/api/ETLSpecification/client/{clientId}/domain/{businessDomain}` | Get specifications by client and domain |
| POST | `/api/ETLSpecification` | Create new specification |
| PUT | `/api/ETLSpecification/{id}` | Update specification |
| DELETE | `/api/ETLSpecification/{id}` | Delete specification |

### Validation

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ETLSpecification/validate` | Validate specification object |
| GET | `/api/ETLSpecification/{id}/validate` | Validate specification by ID |

### Import/Export

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ETLSpecification/{id}/export` | Export specification to JSON |
| POST | `/api/ETLSpecification/import` | Import specification from JSON |

## Data Model

### ETL Specification Structure

```json
{
  "id": "string",
  "clientId": "string",
  "businessDomain": "string",
  "pythonNotebookIds": ["string"],
  "metadata": {
    "name": "string",
    "version": "string",
    "description": "string",
    "createdDate": "datetime",
    "author": "string"
  },
  "schema": {
    "requiredColumns": ["string"],
    "dataTypes": {
      "columnName": "dataType"
    }
  },
  "validationRules": [
    {
      "column": "string",
      "type": "string",
      "description": "string",
      "parameters": {}
    }
  ],
  "constants": {
    "constantName": "value"
  },
  "businessRules": [
    {
      "name": "string",
      "description": "string",
      "formula": "string",
      "dependencies": ["string"],
      "outputColumn": "string"
    }
  ],
  "outputSchema": {
    "requiredColumns": ["string"],
    "optionalColumns": ["string"]
  },
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "createdBy": "string",
  "updatedBy": "string",
  "isActive": "boolean",
  "version": "number"
}
```

## Validation Rules

The API validates ETL specifications using the following rules:

### Required Fields
- ClientId (unique)
- BusinessDomain
- Metadata (name, version)
- Schema (required columns, data types)
- At least one validation rule
- At least one business rule
- At least one constant
- Output schema

### Business Rule Validation
- Formula syntax validation
- Dependency validation (all dependencies must exist)
- Output column uniqueness
- Valid column names (alphanumeric with underscores)

### Cross-Property Validation
- Business rule dependencies must reference existing columns
- Output schema columns must be defined in business rules or schema
- Data types must be defined for all required columns

## Example Usage

### Create a New ETL Specification

```bash
curl -X POST "https://localhost:7001/api/ETLSpecification" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "client123",
    "businessDomain": "Finance",
    "pythonNotebookIds": ["notebook1", "notebook2"],
    "metadata": {
      "name": "Employee Bonus Calculation",
      "version": "1.0",
      "description": "ETL for calculating employee bonuses",
      "author": "John Doe"
    },
    "schema": {
      "requiredColumns": ["employee_id", "base_salary", "performance_score"],
      "dataTypes": {
        "employee_id": "integer",
        "base_salary": "float",
        "performance_score": "float"
      }
    },
    "validationRules": [
      {
        "column": "employee_id",
        "type": "not_null",
        "description": "Employee ID must not be null"
      }
    ],
    "constants": {
      "BONUS_RATE": 0.1
    },
    "businessRules": [
      {
        "name": "calculate_bonus",
        "description": "Calculate bonus based on performance",
        "formula": "df[\"base_salary\"] * df[\"performance_score\"] * BONUS_RATE",
        "dependencies": ["base_salary", "performance_score"],
        "outputColumn": "bonus_amount"
      }
    ],
    "outputSchema": {
      "requiredColumns": ["employee_id", "bonus_amount"],
      "optionalColumns": ["base_salary", "performance_score"]
    },
    "createdBy": "admin"
  }'
```

### Export to JSON

```bash
curl -X GET "https://localhost:7001/api/ETLSpecification/{id}/export"
```

### Import from JSON

```bash
curl -X POST "https://localhost:7001/api/ETLSpecification/import" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonContent": "{...}",
    "clientId": "newClient",
    "createdBy": "admin"
  }'
```

## Development

### Project Structure

```
ETLSpecificationAPI/
├── ETLSpecification.Domain/           # Domain entities and interfaces
│   ├── Entities/                      # Core domain entities
│   ├── Interfaces/                    # Repository interfaces
│   └── Validators/                    # FluentValidation rules
├── ETLSpecification.Application/      # Application services and DTOs
│   ├── DTOs/                         # Data Transfer Objects
│   ├── Services/                     # Business logic services
│   └── Mapping/                      # AutoMapper profiles
├── ETLSpecification.Infrastructure/  # Data access and external services
│   ├── Data/                         # Configuration classes
│   ├── Repositories/                 # MongoDB repository implementations
│   └── DependencyInjection/          # DI configuration
└── ETLSpecificationAPI/              # Web API layer
    ├── Controllers/                  # API controllers
    ├── appsettings.json             # Configuration
    └── Program.cs                   # Application startup
```

### Adding New Features

1. **Domain Layer**: Add entities, interfaces, and validation rules
2. **Application Layer**: Add DTOs, services, and mapping profiles
3. **Infrastructure Layer**: Implement repositories and external services
4. **Web API Layer**: Add controllers and endpoints

### Testing

```bash
# Run tests (when implemented)
dotnet test

# Run with specific configuration
dotnet run --environment Development
```

## Configuration

### Environment Variables

- `MongoDB__ConnectionString`: MongoDB connection string
- `MongoDB__DatabaseName`: Database name
- `MongoDB__CollectionName`: Collection name

### Logging

Configure logging levels in `appsettings.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "ETLSpecification": "Debug",
      "MongoDB": "Debug"
    }
  }
}
```

## Deployment

### Docker

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["ETLSpecificationAPI/ETLSpecificationAPI.csproj", "ETLSpecificationAPI/"]
COPY ["ETLSpecification.Application/ETLSpecification.Application.csproj", "ETLSpecification.Application/"]
COPY ["ETLSpecification.Infrastructure/ETLSpecification.Infrastructure.csproj", "ETLSpecification.Infrastructure/"]
COPY ["ETLSpecification.Domain/ETLSpecification.Domain.csproj", "ETLSpecification.Domain/"]
RUN dotnet restore "ETLSpecificationAPI/ETLSpecificationAPI.csproj"
COPY . .
WORKDIR "/src/ETLSpecificationAPI"
RUN dotnet build "ETLSpecificationAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ETLSpecificationAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ETLSpecificationAPI.dll"]
```

### Azure/AWS Deployment

1. Configure MongoDB connection string for cloud environment
2. Set up environment variables
3. Deploy using your preferred cloud platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.