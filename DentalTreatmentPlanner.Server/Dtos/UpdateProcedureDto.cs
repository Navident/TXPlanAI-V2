namespace DentalTreatmentPlanner.Server.Dtos
{
    public class UpdateProcedureDto
    {
        public int VisitToProcedureMapId { get; set; } 
        public int? VisitId { get; set; }
        public List<ProcedureToCdtMapDto>? Procedures { get; set; }
    }
}
