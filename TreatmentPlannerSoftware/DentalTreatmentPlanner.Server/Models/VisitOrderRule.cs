using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace DentalTreatmentPlanner.Server.Models
{
    public class VisitOrderRule
    {
        public int VisitOrderRuleId { get; set; }

        public int ToothNumberRangeStart { get; set; }

        public int ToothNumberRangeEnd { get; set; }

        public int VisitNumber { get; set; }

        public int OrderValue { get; set; }
    }
}
