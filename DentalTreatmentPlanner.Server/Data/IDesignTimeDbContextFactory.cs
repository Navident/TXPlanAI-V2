using Azure.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace DentalTreatmentPlanner.Server.Data
{
    public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            // logger to catch and display any issues during creation
            var serviceProvider = new ServiceCollection().AddLogging(cfg => cfg.AddConsole()).BuildServiceProvider();
            var logger = serviceProvider.GetService<ILogger<ApplicationDbContextFactory>>();

            try
            {
                var configuration = new ConfigurationBuilder()
                    .AddEnvironmentVariables()
                    .Build();

                var keyVaultEndpoint = new Uri(configuration["VaultUri"]);
                configuration = new ConfigurationBuilder()
                    .AddAzureKeyVault(keyVaultEndpoint, new DefaultAzureCredential())
                    .Build();

                var connectionString = configuration.GetConnectionString("DefaultConnection");
                logger.LogInformation($"Connection string retrieved: {connectionString}");

                var builder = new DbContextOptionsBuilder<ApplicationDbContext>();
                builder.UseSqlServer(connectionString);

                // Add the logger factory to log SQL statements
                ILoggerFactory loggerFactory = LoggerFactory.Create(builder =>
                {
                    builder.AddConsole();
                });
                builder.UseLoggerFactory(loggerFactory);

                return new ApplicationDbContext(builder.Options);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occurred while creating the ApplicationDbContext");
                throw;
            }
        }
    }
}
