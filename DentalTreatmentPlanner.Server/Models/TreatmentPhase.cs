using System.ComponentModel.DataAnnotations;

namespace DentalTreatmentPlanner.Server.Models
{
    public class TreatmentPhase
    {
        public TreatmentPhase()
        {
            CreatedAt = DateTime.UtcNow;
        }

        [Key]
        public int Id { get; set; }

        public DateTime CreatedAt { get; private set; }

        public DateTime? ModifiedAt { get; set; }

        [Required]
        [MaxLength(100)]
        public string Label { get; set; }

        [MaxLength(500)]
        public string Description { get; set; }
    }
}
