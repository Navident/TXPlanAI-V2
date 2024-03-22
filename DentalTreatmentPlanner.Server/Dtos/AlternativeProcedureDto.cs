namespace DentalTreatmentPlanner.Server.Dtos
{
    public class AlternativeProcedureDto
    {
        public int? AlternativeProcedureId { get; set; }
        public int VisitCdtCodeMapId { get; set; }
        public int CdtCodeId { get; set; }
        public string UserDescription { get; set; }
        public string? Code { get; set; } 
    }

}
