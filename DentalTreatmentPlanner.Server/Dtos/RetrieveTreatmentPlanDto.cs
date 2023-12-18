namespace DentalTreatmentPlanner.Server.Dtos
{
    public class RetrieveTreatmentPlanDto
    {
        public int TreatmentPlanId { get; set; }
        public string Description { get; set; }
        public int? ProcedureSubcategoryId { get; set; } // Renamed and made nullable
        public int? ToothNumber { get; set; } // Made nullable
        public int? FacilityProviderMapId { get; set; }
        public int? CreatedUserId { get; set; }

        public ICollection<RetrieveVisitDto> Visits { get; set; }
    }
}
