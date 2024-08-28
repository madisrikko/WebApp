FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Container (Dockerfile)
WORKDIR /src

# Install Node.js
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Copy project files
COPY ["reactapp1.client/nuget.config", "reactapp1.client/"]
COPY ["ReactApp1.Server/ReactApp1.Server.csproj", "ReactApp1.Server/"]
COPY ["reactapp1.client/reactapp1.client.esproj", "reactapp1.client/"]
RUN dotnet restore "./ReactApp1.Server/ReactApp1.Server.csproj"
COPY . .
WORKDIR "/src/ReactApp1.Server"
RUN dotnet build "./ReactApp1.Server.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Publish stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Container (Dockerfile)
RUN dotnet publish "./ReactApp1.Server.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final stage
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ReactApp1.Server.dll"]