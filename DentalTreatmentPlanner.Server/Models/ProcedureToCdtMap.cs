using System.ComponentModel.DataAnnotations.Schema;

namespace DentalTreatmentPlanner.Server.Models
{
    [Table("ProcedureToCdtMap")] 
    public class ProcedureToCdtMap
    {
        public ProcedureToCdtMap()
        {
            CreatedAt = DateTime.UtcNow;
        }

        public int ProcedureToCdtMapId { get; set; } 

        public int VisitToProcedureMapId { get; set; }

        public string? UserDescription { get; set; }

        public int CdtCodeId { get; set; } 

        public bool Default { get; set; } 

        public DateTime CreatedAt { get; private set; }
        public DateTime? ModifiedAt { get; set; }

        public CdtCode CdtCode { get; set; }
        public VisitToProcedureMap VisitToProcedureMap { get; set; } 
    }
}