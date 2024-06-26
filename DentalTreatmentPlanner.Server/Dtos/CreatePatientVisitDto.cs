﻿namespace DentalTreatmentPlanner.Server.Dtos
{
    public class CreatePatientVisitDto
    {
        public string? Description { get; set; }
        public int VisitNumber { get; set; }
        public ICollection<CreateVisitToProcedureMapDto> VisitToProcedureMaps { get; set; }
    }
}
