namespace DentalTreatmentPlanner.Server.Dtos
{
    public class CreateVisitDto
    {
        public int TreatmentPlanId { get; set; }
        public string? Description { get; set; }
        public int VisitNumber { get; set; }
        public string TempVisitId { get; set; }
        public ICollection<VisitCdtCodeMapDto> VisitCdtCodeMaps { get; set; } 

        public CreateVisitDto()
        {
            VisitCdtCodeMaps = new List<VisitCdtCodeMapDto>(); 
        }
    }

}
