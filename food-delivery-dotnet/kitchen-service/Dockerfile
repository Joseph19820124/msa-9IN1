FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["kitchen-service.csproj", "./"]
RUN dotnet restore "kitchen-service.csproj"
COPY . .
RUN dotnet build "kitchen-service.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "kitchen-service.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "kitchen-service.dll"]