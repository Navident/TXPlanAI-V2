﻿namespace DentalTreatmentPlanner.Server.Dtos
{
    public class VisitDto
    {
        public int VisitId { get; set; }
        public string Description { get; set; }
        public int VisitNumber { get; set; }
        public ICollection<VisitCdtCodeMapDto> CdtCodes { get; set; }
    }
}
