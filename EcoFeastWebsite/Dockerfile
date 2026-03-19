# ═══════════════════════════════════════════════════════════════
# Stage 1: Build React Client
# ═══════════════════════════════════════════════════════════════
FROM node:20-alpine AS client-build
WORKDIR /app/client

COPY EcoFeast.Client/package*.json ./
RUN npm ci

COPY EcoFeast.Client/ ./
RUN npm run build

# ═══════════════════════════════════════════════════════════════
# Stage 2: Build .NET API
# ═══════════════════════════════════════════════════════════════
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS api-build
WORKDIR /app

COPY EcoFeast.API/ ./EcoFeast.API/
WORKDIR /app/EcoFeast.API
RUN dotnet publish -c Release -o /app/publish

# ═══════════════════════════════════════════════════════════════
# Stage 3: Production Runtime
# ═══════════════════════════════════════════════════════════════
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=api-build /app/publish .
COPY --from=client-build /app/client/dist ./wwwroot

ENV ASPNETCORE_ENVIRONMENT=Production
ENV DOTNET_RUNNING_IN_CONTAINER=true

EXPOSE 8080
ENTRYPOINT ["dotnet", "EcoFeast.API.dll"]
