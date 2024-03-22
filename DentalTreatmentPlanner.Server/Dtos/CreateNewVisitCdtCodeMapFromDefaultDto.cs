namespace DentalTreatmentPlanner.Server.Dtos
{
    public class CreateNewVisitCdtCodeMapFromDefaultDto
    {
        public int? CdtCodeId { get; set; }
        public string? Description { get; set; }
        public int Order { get; set; }
        public int? ToothNumber { get; set; }
        public string? Surface { get; set; }
        public string? Arch { get; set; }
    }
}
