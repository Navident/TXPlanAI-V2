using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using DentalTreatmentPlanner.Server.Models;

namespace DentalTreatmentPlanner.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DbSet properties
        public DbSet<Facility> Facilities { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<FacilityProviderMap> FacilityProviderMaps { get; set; }
        public DbSet<VisitCdtCodeMap> VisitCdtCodeMaps { get; set; }
        public DbSet<Provider> Providers { get; set; }
        public DbSet<TreatmentPlan> TreatmentPlans { get; set; }
        public DbSet<Visit> Visits { get; set; }
        public DbSet<CdtCode> CdtCodes { get; set; }
        public DbSet<CdtCodeCategory> CdtCodeCategories { get; set; }
        public DbSet<CdtCodeSubcategory> CdtCodeSubcategories { get; set; }
        public DbSet<ProcedureType> ProcedureTypes { get; set; }
        public DbSet<ProcedureCategory> ProcedureCategories { get; set; }
        public DbSet<ProcedureSubCategory> ProcedureSubCategories { get; set; }
        public DbSet<AlternativeProcedure> AlternativeProcedures { get; set; }
        public DbSet<VisitOrderRule> VisitOrderRules { get; set; }
        public DbSet<Payer> Payers { get; set; }
        public DbSet<PayerFacilityMap> PayerFacilityMaps { get; set; }
        public DbSet<UcrFee> UcrFees { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Patient>().ToTable("Patient");
            modelBuilder.Entity<Payer>().ToTable("Payer");
            modelBuilder.Entity<PayerFacilityMap>().ToTable("PayerFacilityMap");
            modelBuilder.Entity<UcrFee>().ToTable("UcrFee");
            modelBuilder.Entity<UcrFee>(entity =>
            {
                entity.Property(e => e.UcrDollarAmount)
                      .HasColumnType("decimal(18, 2)");

                entity.Property(e => e.DiscountFeeDollarAmount)
                      .HasColumnType("decimal(18, 2)"); 
            });

            // Map Facility entity
            modelBuilder.Entity<Facility>(entity =>
            {
                entity.ToTable("facility");
                entity.Property(e => e.FacilityId).HasColumnName("facility_id");
                entity.Property(e => e.Name).HasColumnName("name").IsRequired(false);
                entity.Property(e => e.Street).HasColumnName("street").IsRequired(false);
                entity.Property(e => e.Suite).HasColumnName("suite").IsRequired(false);
                entity.Property(e => e.ZipCode).HasColumnName("zip_code").IsRequired(false);
                entity.Property(e => e.City).HasColumnName("city").IsRequired(false);
                entity.Property(e => e.CreatedAt).HasColumnName("created_at").IsRequired(false); 
                entity.Property(e => e.ModifiedAt).HasColumnName("modified_at").IsRequired(false); 
            });
            // Map FacilityProviderMap entity
            modelBuilder.Entity<FacilityProviderMap>(entity =>
            {
                entity.ToTable("facility_provider_map");
                entity.Property(e => e.FacilityProviderMapId).HasColumnName("facility_provider_map_id");
                entity.Property(e => e.FacilityId).HasColumnName("facility_id");
                entity.Property(e => e.ProviderId).HasColumnName("provider_id");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.ModifiedAt).HasColumnName("modified_at");
            });
            // Map VisitCdtCodeMap entity
            modelBuilder.Entity<VisitCdtCodeMap>(entity =>
            {
                entity.ToTable("visit_cdt_code_map");
                entity.Property(e => e.VisitCdtCodeMapId).HasColumnName("visit_cdt_code_map_id");
                entity.Property(e => e.VisitId).HasColumnName("visit_id");
                entity.Property(e => e.CdtCodeId).HasColumnName("cdt_code_id");
                entity.Property(e => e.Order).HasColumnName("order");
                entity.Property(e => e.ProcedureTypeId).HasColumnName("procedure_type_id");
                entity.Property(e => e.ToothNumber).HasColumnName("tooth_number"); 
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.ModifiedAt).HasColumnName("modified_at");
            });
            // Map Provider entity
            modelBuilder.Entity<Provider>(entity =>
            {
                entity.ToTable("provider");
                entity.Property(e => e.ProviderId).HasColumnName("provider_id");
                entity.Property(e => e.LastName).HasColumnName("last_name");
                entity.Property(e => e.FirstName).HasColumnName("first_name");
                entity.Property(e => e.Npi).HasColumnName("npi");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.ModifiedAt).HasColumnName("modified_at");
            });
            // Map TreatmentPlan entity
            modelBuilder.Entity<TreatmentPlan>(entity =>
            {
                entity.ToTable("treatment_plan");
                entity.Property(e => e.TreatmentPlanId).HasColumnName("treatment_plan_id");
                entity.Property(e => e.Description).HasColumnName("description");
                entity.Property(e => e.ProcedureSubcategoryId).HasColumnName("procedure_subcategory_id"); 
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.CreatedUserId).HasColumnName("created_user_id");
                entity.Property(e => e.ModifiedAt).HasColumnName("modified_at");
            });
            // Map Visit entity
            modelBuilder.Entity<Visit>(entity =>
            {
                entity.ToTable("visit");
                entity.Property(e => e.VisitId).HasColumnName("visit_id");
                entity.Property(e => e.Description).HasColumnName("description");
                entity.Property(e => e.TreatmentPlanId).HasColumnName("treatment_plan_id");
                entity.Property(e => e.VisitNumber).HasColumnName("visit_number");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.CreatedUserId).HasColumnName("created_user_id");
                entity.Property(e => e.ModifiedAt).HasColumnName("modified_at");
            });

            // Map CdtCode entity
            modelBuilder.Entity<CdtCode>(entity =>
            {
                entity.ToTable("cdt_code");
                entity.Property(e => e.CdtCodeId).HasColumnName("cdt_code_id");
                entity.Property(e => e.Code).HasColumnName("cdt_code"); 
                entity.Property(e => e.FacilityId).HasColumnName("facility_id").IsRequired(false); ;
                entity.Property(e => e.CdtCodeCategoryId).HasColumnName("cdt_code_category_id").IsRequired(false); ;
                entity.Property(e => e.CdtCodeSubcategoryId).HasColumnName("cdt_code_subcategory_id").IsRequired(false); ;
                entity.Property(e => e.LongDescription).HasColumnName("long_description");
                entity.Property(e => e.ShortDescription).HasColumnName("short_description").IsRequired(false); ;
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.ModifiedAt).HasColumnName("modified_at").IsRequired(false); ;
            });
            // Map CdtCodeCategory entity
            modelBuilder.Entity<CdtCodeCategory>(entity =>
            {
                entity.ToTable("cdt_code_category");
                entity.Property(e => e.CdtCodeCategoryId).HasColumnName("cdt_code_category_id");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.ModifiedAt).HasColumnName("modified_at");
            });
            // Map CdtCodeSubcategory entity
            modelBuilder.Entity<CdtCodeSubcategory>(entity =>
            {
                entity.ToTable("cdt_code_subcategory");
                entity.Property(e => e.CdtCodeSubcategoryId).HasColumnName("cdt_code_subcategory_id");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.ModifiedAt).HasColumnName("modified_at");
            });
            // Map ProcedureType entity
            modelBuilder.Entity<ProcedureType>(entity =>
            {
                entity.ToTable("procedure_type");
                entity.Property(e => e.ProcedureTypeId).HasColumnName("procedure_type_id");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.Description).HasColumnName("description");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.ModifiedAt).HasColumnName("modified_at");
            });
            // Map ProcedureCategory entity
            modelBuilder.Entity<ProcedureCategory>(entity =>
            {
                entity.ToTable("procedure_category");
                entity.Property(e => e.ProcedureCategoryId).HasColumnName("procedure_category_id");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.Description).HasColumnName("description");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.ModifiedAt).HasColumnName("modified_at");

                // Define the one-to-many relationship with ProcedureSubCategory
                entity.HasMany(c => c.ProcedureSubCategories)
                      .WithOne(s => s.ProcedureCategory)
                      .HasForeignKey(s => s.ProcedureCategoryId);
            });
            // Map ProcedureCategory entity
            modelBuilder.Entity<ProcedureSubCategory>(entity =>
            {
                entity.ToTable("procedure_subcategory");
                entity.Property(e => e.ProcedureSubCategoryId).HasColumnName("procedure_subcategory_id");
                entity.Property(e => e.ProcedureCategoryId).HasColumnName("procedure_category_id");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.Description).HasColumnName("description");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.ModifiedAt).HasColumnName("modified_at");

                // Define the foreign key relationship
                entity.HasOne(d => d.ProcedureCategory)
                    .WithMany(p => p.ProcedureSubCategories)
                    .HasForeignKey(d => d.ProcedureCategoryId);
            });
            // Map AlternativeProcedure entity
            modelBuilder.Entity<AlternativeProcedure>(entity =>
            {
                entity.ToTable("alternative_procedure");
                entity.Property(e => e.AlternativeProcedureId).HasColumnName("alternative_procedure_id");
                entity.Property(e => e.CdtCodeId).HasColumnName("cdt_code_id");
                entity.Property(e => e.Type).HasColumnName("type");
                entity.Property(e => e.Description).HasColumnName("description");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at");
                entity.Property(e => e.ModifiedAt).HasColumnName("modified_at");
            });

            // Configure VisitOrderRule entity
            modelBuilder.Entity<VisitOrderRule>(entity =>
            {
                entity.ToTable("visit_order_rule");
                entity.HasKey(e => e.VisitOrderRuleId); // Configure VisitOrderRuleId as the primary key
                entity.Property(e => e.VisitOrderRuleId).HasColumnName("visit_order_rule_id");
                entity.Property(e => e.ToothNumberRangeStart).HasColumnName("tooth_number_range_start");
                entity.Property(e => e.ToothNumberRangeEnd).HasColumnName("tooth_number_range_end");
                entity.Property(e => e.VisitNumber).HasColumnName("visit_number");
                entity.Property(e => e.OrderValue).HasColumnName("order_value");
            });


        }
    }
}
