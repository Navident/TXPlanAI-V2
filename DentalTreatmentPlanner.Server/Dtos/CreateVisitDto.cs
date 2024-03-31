﻿namespace DentalTreatmentPlanner.Server.Dtos
{
    public class CreateVisitDto
    {
        public int TreatmentPlanId { get; set; }
        public string? Description { get; set; }
        public int VisitNumber { get; set; }
        public string TempVisitId { get; set; }
        public ICollection<VisitToProcedureMapDto> Procedures { get; set; }

        public CreateVisitDto()
        {
            Procedures = new List<VisitToProcedureMapDto>();
        }
    }

}
