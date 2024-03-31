namespace DentalTreatmentPlanner.Server.Dtos
{
    public class CreateNewVisitToProcedureDto
    {
        public int Order { get; set; }
        public int? ToothNumber { get; set; }
        public string? Surface { get; set; }
        public string? Arch { get; set; }
        public List<CreateNewProcedureToCdtDto> ProcedureToCdtMaps { get; set; } = new List<CreateNewProcedureToCdtDto>();
    }

}
