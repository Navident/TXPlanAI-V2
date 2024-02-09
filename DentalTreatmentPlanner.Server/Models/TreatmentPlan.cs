namespace DentalTreatmentPlanner.Server.Models
{
    public class TreatmentPlan
    {
        public TreatmentPlan()
        {
            Visits = new List<Visit>();
            CreatedAt = DateTime.UtcNow; 
        }

        public int TreatmentPlanId { get; set; }
        public string Description { get; set; }
        public int? ProcedureSubcategoryId { get; set; }
        public DateTime CreatedAt { get; private set; } 
        public int? CreatedUserId { get; set; }
        public DateTime? ModifiedAt { get; set; }

        public int? PayerId { get; set; }

        public ProcedureSubCategory ProcedureSubcategory { get; set; } 
        public ICollection<Visit> Visits { get; set; }
        public int? FacilityId { get; set; }
        public virtual Facility Facility { get; set; }
        public int? PatientId { get; set; }
        public virtual Patient Patient { get; set; }
        public virtual Payer Payer { get; set; }
    }
}
