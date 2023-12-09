namespace DentalTreatmentPlanner.Server.Models
{
    public class Visit
    {
        public int VisitId { get; set; }
        public string Description { get; set; }
        public int TreatmentPlanId { get; set; }
        public int VisitNumber { get; set; }
        public DateTime CreatedAt { get; set; }
        public int CreatedUserId { get; set; }
        public DateTime? ModifiedAt { get; set; }

        public TreatmentPlan TreatmentPlan { get; set; }
        public User CreatedUser { get; set; }
        public ICollection<VisitCdtCodeMap> VisitCdtCodeMaps { get; set; }
    }
}
