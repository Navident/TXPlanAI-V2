using Azure.Identity;
using DentalTreatmentPlanner.Server.Data;
using DentalTreatmentPlanner.Server.Models;
using DentalTreatmentPlanner.Server.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;


var builder = WebApplication.CreateBuilder(args);

// Configure logging
builder.Logging.AddFilter("System.Net.Http.HttpClient", LogLevel.Debug);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

//var vaultUri = Environment.GetEnvironmentVariable("VaultUri");
var vaultUri = "https://navidentkeyvault.vault.azure.net/";
var keyVaultEndpoint = new Uri(vaultUri);  
builder.Configuration.AddAzureKeyVault(keyVaultEndpoint, new DefaultAzureCredential());

// Add DbContext using SQL Server Provider
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseSqlServer(connectionString);


    options.EnableSensitiveDataLogging();
    
});

// Add ASP.NET Core Identity services
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("HK7RVoSagLhrSkJeNGpOTZTrvqMLboQAX5ZsY7Tv6Cs=")), // Replace with a secure key
            ValidateIssuer = false,
            ValidateAudience = false,
            NameClaimType = ClaimTypes.Name
        };
    });

builder.Services.AddHttpClient();

// Register DentalTreatmentPlanner service
builder.Services.AddScoped<DentalTreatmentPlannerService>();
builder.Services.AddScoped<OpenDentalService>();

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("MyCorsPolicy", builder =>
    {
        builder.WithOrigins("*") //allow any origin, only for testing
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

// Add controllers and configure JSON options
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

// Learn more about configuring Swagger/OpenAPI - https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddApplicationInsightsTelemetry(builder.Configuration["APPLICATIONINSIGHTS_CONNECTION_STRING"]);

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use CORS policy
app.UseCors("MyCorsPolicy");

app.UseHttpsRedirection();

// Use Authentication and Authorization
app.UseAuthentication();
app.UseRouting();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
