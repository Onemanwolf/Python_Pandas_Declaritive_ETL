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
RUN dotnet publish "ETLSpecificationAPI.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ETLSpecificationAPI.dll"]