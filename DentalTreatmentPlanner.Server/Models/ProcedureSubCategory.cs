namespace DentalTreatmentPlanner.Server.Models
{
    public class ProcedureSubCategory
    {
        public int ProcedureSubCategoryId { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }

        // Foreign key for ProcedureCategory
        public int ProcedureCategoryId { get; set; }

        // Navigation property to ProcedureCategory
        public ProcedureCategory ProcedureCategory { get; set; }

        public ICollection<TreatmentPlan> TreatmentPlans { get; set; }
    }
}

