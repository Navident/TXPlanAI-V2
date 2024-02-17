namespace DentalTreatmentPlanner.Server.Dtos
{
    public class CreateVisitCdtCodeMapDto
    {
        public int CdtCodeId { get; set; }
        public string Description { get; set; }
        public int Order { get; set; }
        public int ToothNumber { get; set; }
    }
}
