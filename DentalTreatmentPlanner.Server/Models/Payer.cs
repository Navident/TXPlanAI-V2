namespace DentalTreatmentPlanner.Server.Models
{
    public class Payer
    {
        public Payer()
        {
            PayerFacilityMaps = new List<PayerFacilityMap>();
            CreatedAt = DateTime.UtcNow;
        }

        public int PayerId { get; set; }
        public string PayerName { get; set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime? ModifiedAt { get; set; }

        public ICollection<PayerFacilityMap> PayerFacilityMaps { get; set; }
    }
}
