using Microsoft.DotNet.Scaffolding.Shared;

namespace DentalTreatmentPlanner.Server.Models
{
    public class FacilityProviderMap
    {
        public int FacilityProviderMapId { get; set; }
        public int FacilityId { get; set; }
        public int ProviderId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }

        public Facility Facility { get; set; }
        public Provider Provider { get; set; }
    }
}
