namespace DentalTreatmentPlanner.Server.Models
{
    public class ProcedureCategory
    {
        public int ProcedureCategoryId { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }

        public ICollection<TreatmentPlan> TreatmentPlans { get; set; }
        public ICollection<ProcedureCategoryCdtCodeMap> ProcedureCategoryCdtCodeMaps { get; set; }
    }
}

