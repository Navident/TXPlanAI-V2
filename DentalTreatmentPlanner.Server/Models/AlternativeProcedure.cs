namespace DentalTreatmentPlanner.Server.Models
{
    public class AlternativeProcedure
    {
        public int AlternativeProcedureId { get; set; }
        public int CdtCodeId { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }

        public CdtCode CdtCode { get; set; }
    }
}
