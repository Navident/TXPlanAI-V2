namespace DentalTreatmentPlanner.Server.Models
{
    public class VisitCdtCodeMap
    {
        public int VisitCdtCodeMapId { get; set; }
        public int VisitId { get; set; }
        public int CdtCodeId { get; set; }
        public int Order { get; set; }
        public int? ProcedureTypeId { get; set; }
        public int? TreatmentPhaseId { get; set; } 

        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }

        public Visit Visit { get; set; }
        public CdtCode CdtCode { get; set; }
        public ProcedureType ProcedureType { get; set; }
        public TreatmentPhase TreatmentPhase { get; set; } 

    }
}
