namespace DentalTreatmentPlanner.Server.Models
{
    public class PayerFacilityMap
    {
        public PayerFacilityMap()
        {
            CreatedAt = DateTime.UtcNow;
        }

        public int PayerFacilityMapId { get; set; }
        public int PayerId { get; set; }
        public int FacilityId { get; set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime? ModifiedAt { get; set; }

        public Payer Payer { get; set; }
        public Facility Facility { get; set; }
    }
}
