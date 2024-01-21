namespace DentalTreatmentPlanner.Server.Dtos
{
    public class UpdateTreatmentPlanDto
    {
        public int TreatmentPlanId { get; set; }
        public string Description { get; set; }
        public int? ProcedureSubcategoryId { get; set; }
        public int ToothNumber { get; set; }

        public int PatientId { get; set; } //keep this?

        public ICollection<UpdateVisitDto> Visits { get; set; }
        public ICollection<int> DeletedVisitIds { get; set; }
    }
}
