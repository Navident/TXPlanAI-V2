namespace DentalTreatmentPlanner.Server.Dtos
{
    public class CreateNewProcedureToCdtDto
    {
        public string? UserDescription { get; set; }
        public int CdtCodeId { get; set; }
        public bool Default { get; set; }
    }
}
