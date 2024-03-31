namespace DentalTreatmentPlanner.Server.Dtos
{
    public class NewTxFromDefaultVisitDto
    {
        public string? Description { get; set; }
        //public int VisitNumber { get; set; }
        public List<CreateNewVisitToProcedureDto> VisitToProcedureMaps { get; set; } = new List<CreateNewVisitToProcedureDto>();
    }

}
