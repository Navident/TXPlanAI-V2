namespace DentalTreatmentPlanner.Server.Dtos
{
    public class TreatmentPhaseDto
    {
        public int Id { get; set; }
        public string Label { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
    }

}
