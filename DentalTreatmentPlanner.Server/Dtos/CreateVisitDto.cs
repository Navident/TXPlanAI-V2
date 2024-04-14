namespace DentalTreatmentPlanner.Server.Dtos
{
    public class CreateVisitDto
    {
        public int TreatmentPlanId { get; set; }
        public string? Description { get; set; }
        public int VisitNumber { get; set; }
        public string TempVisitId { get; set; }
        public ICollection<VisitToProcedureMapDto> VisitToProcedureMaps { get; set; }

        public CreateVisitDto()
        {
            VisitToProcedureMaps = new List<VisitToProcedureMapDto>();
        }
    }

}
