namespace DentalTreatmentPlanner.Server.Models
{
    public class TreatmentPlan
    {
        public int TreatmentPlanId { get; set; }
        public string Description { get; set; }
        public int? FacilityProviderMapId { get; set; }
        public int? ProcedureSubcategoryId { get; set; } 
        public int? ToothNumber { get; set; } 
        public DateTime CreatedAt { get; set; }
        public int? CreatedUserId { get; set; }
        public DateTime? ModifiedAt { get; set; }

        public FacilityProviderMap FacilityProviderMap { get; set; }
        public ProcedureSubCategory ProcedureSubcategory { get; set; } 
        //public User CreatedUser { get; set; }
        public ICollection<Visit> Visits { get; set; }
    }
}
