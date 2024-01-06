using Microsoft.AspNetCore.Identity;

namespace DentalTreatmentPlanner.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string BusinessName { get; set; }
        // Other custom properties will be added here as well
    }

}
