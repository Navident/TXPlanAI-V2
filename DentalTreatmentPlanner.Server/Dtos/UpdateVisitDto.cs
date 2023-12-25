namespace DentalTreatmentPlanner.Server.Dtos
{
    public class UpdateVisitDto
    {
        public int VisitId { get; set; }
        public string Description { get; set; }
        public int VisitNumber { get; set; }  

        public ICollection<int> CdtCodeIds { get; set; }
        public ICollection<VisitCdtCodeMapDto> VisitCdtCodeMaps { get; set; }

    }
}
