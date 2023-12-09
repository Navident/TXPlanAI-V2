namespace DentalTreatmentPlanner.Server.Dtos
{
    public class TreatmentPlanDto
    {
        public int TreatmentPlanId { get; set; }
        public string Description { get; set; }
        public int FacilityProviderMapId { get; set; }
        public int ProcedureCategoryId { get; set; }
        public int ToothNumber { get; set; }
        public int CreatedUserId { get; set; }

        public ICollection<VisitDto> Visits { get; set; }
    }
}
