namespace DentalTreatmentPlanner.Server.Models
{
    public class ProcedureCategoryCdtCodeMap
    {
        public int MapId { get; set; }
        public int ProcedureCategoryId { get; set; }
        public int CdtCodeId { get; set; }

        public virtual ProcedureCategory ProcedureCategory { get; set; }
        public virtual CdtCode CdtCode { get; set; }
    }
}
