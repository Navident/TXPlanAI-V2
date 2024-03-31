namespace DentalTreatmentPlanner.Server.Dtos
{
    public class UpdateTreatmentPlanDto
    {
        public int TreatmentPlanId { get; set; }
        public string? Description { get; set; }
        public int? ProcedureSubcategoryId { get; set; }
        public int? ToothNumber { get; set; } 
        public int PatientId { get; set; }
        public int? PayerId { get; set; }

        public ICollection<UpdateVisitDto> Visits { get; set; } = new List<UpdateVisitDto>();
        public ICollection<int> DeletedVisitIds { get; set; } = new List<int>();
    }
}
