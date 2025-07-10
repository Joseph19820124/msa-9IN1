using Microsoft.EntityFrameworkCore;
using RestaurantService.Data;
using RestaurantService.Services;
using Consul;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Entity Framework
builder.Services.AddDbContext<RestaurantDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add custom services
builder.Services.AddScoped<IRestaurantService, RestaurantService.Services.RestaurantService>();

// Add Consul
builder.Services.AddSingleton<IConsulClient, ConsulClient>(p => new ConsulClient(consulConfig =>
{
    var address = builder.Configuration["Consul:Host"];
    consulConfig.Address = new Uri(address);
}));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Register with Consul
var consulClient = app.Services.GetRequiredService<IConsulClient>();
var registration = new AgentServiceRegistration()
{
    ID = "restaurant-service",
    Name = "restaurant-service",
    Address = "localhost",
    Port = 5003,
    Check = new AgentServiceCheck()
    {
        HTTP = "http://localhost:5003/health",
        Interval = TimeSpan.FromSeconds(10)
    }
};

await consulClient.Agent.ServiceRegister(registration);

app.Run();