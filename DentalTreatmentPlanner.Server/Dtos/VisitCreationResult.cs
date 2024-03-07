using DentalTreatmentPlanner.Server.Models;

namespace DentalTreatmentPlanner.Server.Dtos
{
    public class VisitCreationResult
    {
        public Visit Visit { get; set; }
        public string TempVisitId { get; set; }
    }
}
