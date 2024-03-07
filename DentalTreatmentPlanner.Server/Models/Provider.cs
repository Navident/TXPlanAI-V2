namespace DentalTreatmentPlanner.Server.Models
{
    public class Provider
    {
        public int ProviderId { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string Npi { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }

        public ICollection<FacilityProviderMap> FacilityProviderMaps { get; set; }
    }
}
