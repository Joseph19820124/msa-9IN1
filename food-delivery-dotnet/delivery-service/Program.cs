using Microsoft.EntityFrameworkCore;
using DeliveryService.Data;
using DeliveryService.Services;
using Consul;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Entity Framework
builder.Services.AddDbContext<DeliveryDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add custom services
builder.Services.AddScoped<IDeliveryService, DeliveryService.Services.DeliveryService>();

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
    ID = "delivery-service",
    Name = "delivery-service",
    Address = "localhost",
    Port = 5005,
    Check = new AgentServiceCheck()
    {
        HTTP = "http://localhost:5005/health",
        Interval = TimeSpan.FromSeconds(10)
    }
};

await consulClient.Agent.ServiceRegister(registration);

app.Run();