using AutoMapper;
using ETLSpecification.Application.DTOs;
using ETLSpecification.Domain.Models;
using ETLSpec = ETLSpecification.Domain.Models.ETLSpecification;

namespace ETLSpecification.Application.Mapping;

public class ETLSpecificationMappingProfile : Profile
{
    public ETLSpecificationMappingProfile()
    {
        // Domain to DTO mappings
        CreateMap<ETLSpec, ETLSpecificationDto>();
        CreateMap<ETLSpec, ETLSpecificationSummaryDto>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Metadata.Name))
            .ForMember(dest => dest.Version, opt => opt.MapFrom(src => src.Metadata.Version));

        CreateMap<Metadata, MetadataDto>();
        CreateMap<Schema, SchemaDto>();
        CreateMap<ValidationRule, ValidationRuleDto>();
        CreateMap<BusinessRule, BusinessRuleDto>();
        CreateMap<OutputSchema, OutputSchemaDto>();        // DTO to Domain mappings
        CreateMap<CreateETLSpecificationDto, ETLSpec>();
        CreateMap<UpdateETLSpecificationDto, ETLSpec>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.ClientId, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
            .ForMember(dest => dest.IsActive, opt => opt.Ignore());

        // ETLSpecificationDto to Domain mapping (for validation)
        CreateMap<ETLSpecificationDto, ETLSpec>();

        CreateMap<MetadataDto, Metadata>();
        CreateMap<SchemaDto, Schema>();
        CreateMap<ValidationRuleDto, ValidationRule>();
        CreateMap<BusinessRuleDto, BusinessRule>();
        CreateMap<OutputSchemaDto, OutputSchema>();
    }
}