using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace DentalTreatmentPlanner.Server.Models
{
    public class ApplicationUser : IdentityUser
    {

        // property for the facility_id foreign key
        [ForeignKey("Facility")]
        public int? FacilityId { get; set; }

        // Navigation property for Facility
        public virtual Facility Facility { get; set; }

    }

}
