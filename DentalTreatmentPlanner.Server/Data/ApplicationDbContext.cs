//using DentalTreatmentPlanner.Server.Models;
using DentalTreatmentPlanner.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace DentalTreatmentPlanner.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DbSet properties
        public DbSet<Facility> Facilities { get; set; }
        public DbSet<FacilityProviderMap> FacilityProviderMaps { get; set; }
        public DbSet<VisitCdtCodeMap> VisitCdtCodeMaps { get; set; }
        public DbSet<Provider> Providers { get; set; }
        public DbSet<TreatmentPlan> TreatmentPlans { get; set; }
        public DbSet<Visit> Visits { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<CdtCode> CdtCodes { get; set; }
        public DbSet<CdtCodeCategory> CdtCodeCategories { get; set; }
        public DbSet<CdtCodeSubcategory> CdtCodeSubcategories { get; set; }
        public DbSet<ProcedureType> ProcedureTypes { get; set; }
        public DbSet<ProcedureCategory> ProcedureCategories { get; set; }
        public DbSet<AlternativeProcedure> AlternativeProcedures { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Model configuration code goes here
           
        }
    }
}
