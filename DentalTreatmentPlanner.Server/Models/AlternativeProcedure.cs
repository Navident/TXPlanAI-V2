namespace DentalTreatmentPlanner.Server.Models
{
    public class AlternativeProcedure
    {
        public AlternativeProcedure()
        {
            CreatedAt = DateTime.UtcNow; 
        }
        public int AlternativeProcedureId { get; set; }
        public int VisitCdtCodeMapId { get; set; } 
        public int CdtCodeId { get; set; } 
        public string UserDescription { get; set; }

        public DateTime CreatedAt { get; private set; }
        public DateTime? ModifiedAt { get; set; }

        public VisitCdtCodeMap VisitCdtCodeMap { get; set; }
        public CdtCode CdtCode { get; set; }
    }
}
