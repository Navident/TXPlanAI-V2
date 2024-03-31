namespace DentalTreatmentPlanner.Server.Dtos
{
    public class CreateVisitToProcedureMapDto
    {
        public int VisitToProcedureMapId { get; set; }

        public int Order { get; set; }
        public int? ToothNumber { get; set; }
        public string? Surface { get; set; }
        public string? Arch { get; set; }
        public int? ProcedureTypeId { get; set; }
        public string? Description { get; set; }

        public ICollection<CreateNewProcedureToCdtDto> ProcedureToCdtMaps { get; set; }

    }
}
