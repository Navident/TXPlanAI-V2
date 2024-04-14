namespace DentalTreatmentPlanner.Server.Dtos
{
    public class ProcedureToCdtMapDto
    {
        public int? ProcedureToCdtMapId { get; set; }
        public int CdtCodeId { get; set; }
        public bool Default { get; set; }
        public bool Repeatable { get; set; }
        public string? UserDescription { get; set; }
        public string Code { get; set; }
        public string? LongDescription { get; set; }
    }

}
