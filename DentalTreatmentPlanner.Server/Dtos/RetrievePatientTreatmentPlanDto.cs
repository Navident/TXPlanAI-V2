namespace DentalTreatmentPlanner.Server.Dtos
{
    public class RetrievePatientTreatmentPlanDto
    {
        public int TreatmentPlanId { get; set; }
        public string Description { get; set; }
        public int? ProcedureSubcategoryId { get; set; }
        public int? ToothNumber { get; set; } 
        public int? FacilityId { get; set; }
        public int? PayerId { get; set; }
        public int? CreatedUserId { get; set; }
        public DateTime CreatedAt { get; set; }

        public ICollection<RetrieveVisitDto> Visits { get; set; }
    }
}
