namespace DentalTreatmentPlanner.Server.Models
{
    public class VisitToProcedureMap
    {
        public VisitToProcedureMap()
        {
            ProcedureToCdtMaps = new HashSet<ProcedureToCdtMap>();
            Repeatable = true;
            AssignToothNumber = true;
            AssignArch = true;
        }
        public int VisitToProcedureMapId { get; set; } 
        public int VisitId { get; set; }
        public int Order { get; set; }
        public int? ToothNumber { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public string? Surface { get; set; }
        public string? Arch { get; set; }
        public int? ProcedureTypeId { get; set; }
        public bool Repeatable { get; set; }
        public bool AssignToothNumber { get; set; }
        public bool AssignArch { get; set; }
        public Visit Visit { get; set; }
        public ProcedureType ProcedureType { get; set; }
        public ICollection<ProcedureToCdtMap> ProcedureToCdtMaps { get; set; }
    }
}