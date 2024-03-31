namespace DentalTreatmentPlanner.Server.Models
{
    public class ProcedureType
    {
        public int? ProcedureTypeId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }

        //public ICollection<VisitCdtCodeMap> VisitCdtCodeMaps { get; set; }
    }
}
