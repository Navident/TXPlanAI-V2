namespace DentalTreatmentPlanner.Server.Dtos
{
    public class VisitCdtCodeMapDto
    {
        public int VisitCdtCodeMapId { get; set; }
        public int VisitId { get; set; }
        public int CdtCodeId { get; set; }
        public string Code { get; set; } 
        public int Order { get; set; }
        public int? ProcedureTypeId { get; set; }
        public int? ToothNumber { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public string LongDescription { get; set; }
    }
}
