namespace DentalTreatmentPlanner.Server.Dtos
{
    public class NewTxFromDefaultVisitDto
    {
        public string? Description { get; set; }
        public int VisitNumber { get; set; } 
        public List<CreateVisitCdtCodeMapDto> VisitCdtCodeMaps { get; set; } = new List<CreateVisitCdtCodeMapDto>();
    }
}
