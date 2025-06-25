using ETLSpecification.Application.Services;
using ETLSpecification.Domain.Interfaces;
using ETLSpecification.Domain.Validators;
using ETLSpecification.Infrastructure.Data;
using ETLSpecification.Infrastructure.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ETLSpecification.Infrastructure.DependencyInjection;

public static class InfrastructureServiceCollectionExtensions
{    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {        // Configure MongoDB settings
        services.Configure<MongoDBSettings>(options =>
            configuration.GetSection("MongoDB").Bind(options));

        // Register repositories
        services.AddScoped<IETLSpecificationRepository, MongoDBETLSpecificationRepository>();

        // Register validators
        services.AddScoped<ETLSpecificationValidator>();

        return services;
    }
}