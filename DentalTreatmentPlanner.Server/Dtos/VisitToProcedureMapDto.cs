using DentalTreatmentPlanner.Server.Models;

namespace DentalTreatmentPlanner.Server.Dtos
{
    public class VisitToProcedureMapDto
    {

        public int VisitToProcedureMapId { get; set; }
        public int? VisitId { get; set; }
        public int Order { get; set; }
        public int? ToothNumber { get; set; }
        public int? ProcedureTypeId { get; set; }
        public string? Surface { get; set; }
        public string? Arch { get; set; }
        public bool Repeatable { get; set; }
        public bool AssignToothNumber { get; set; }
        public bool AssignArch { get; set; }

        // This will hold the mapped CDT codes for the procedure
        public List<ProcedureToCdtMapDto> ProcedureToCdtMaps { get; set; } = new List<ProcedureToCdtMapDto>();

        public VisitToProcedureMapDto()
        {
            ProcedureToCdtMaps = new List<ProcedureToCdtMapDto>();
        }
    }


}
