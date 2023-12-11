namespace DentalTreatmentPlanner.Server.Dtos
{
    public class CreateTreatmentPlanDto
    {
        public string Description { get; set; }
        public int ProcedureCategoryId { get; set; }
        public int ToothNumber { get; set; }
        public int? FacilityProviderMapId { get; set; }
        public int? CreatedUserId { get; set; }

        public ICollection<CreateVisitDto> Visits { get; set; }
    }
}
