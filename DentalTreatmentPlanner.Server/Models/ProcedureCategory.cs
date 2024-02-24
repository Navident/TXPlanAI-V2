using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace DentalTreatmentPlanner.Server.Models
{
    public class ProcedureCategory
    {
        public int ProcedureCategoryId { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ModifiedAt { get; set; }

        public ICollection<ProcedureSubCategory> ProcedureSubCategories { get; set; }
    }
}
