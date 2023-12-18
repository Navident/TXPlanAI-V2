namespace DentalTreatmentPlanner.Server.Dtos
{
    public class CreateVisitDto
    {
        public int VisitId { get; set; }
        public string Description { get; set; }
        public ICollection<int> CdtCodeIds { get; set; } 
    }
}
