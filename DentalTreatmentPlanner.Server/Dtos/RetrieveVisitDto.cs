namespace DentalTreatmentPlanner.Server.Dtos
{
    public class RetrieveVisitDto
    {
        public int VisitId { get; set; }
        public string Description { get; set; }
        public int VisitNumber { get; set; }
        public List<VisitToProcedureMapDto> Procedures { get; set; } = new List<VisitToProcedureMapDto>();
    }

}
