namespace DentalTreatmentPlanner.Server.Dtos
{
    public class VisitCdtCodeMapDto
    {
        public int VisitCdtCodeMapId { get; set; }
        public int VisitId { get; set; }
        public int CdtCodeId { get; set; }
        public string Code { get; set; } // Property to hold the actual CDT code string
        public int Order { get; set; }
        public int? ProcedureTypeId { get; set; } // Assuming ProcedureTypeId can be nullable
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
    }
}
