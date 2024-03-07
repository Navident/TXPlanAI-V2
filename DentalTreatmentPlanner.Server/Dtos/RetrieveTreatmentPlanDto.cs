namespace DentalTreatmentPlanner.Server.Dtos
{
    public class RetrieveTreatmentPlanDto
    {
        public int TreatmentPlanId { get; set; }
        public string Description { get; set; }
        public int? ProcedureSubcategoryId { get; set; }
        public string ProcedureSubCategoryName { get; set; }
        public string ProcedureCategoryName { get; set; }
        public int? FacilityId { get; set; }
        public int? CreatedUserId { get; set; }
        public int? PayerId { get; set; }

        public ICollection<RetrieveVisitDto> Visits { get; set; }
    }
}
