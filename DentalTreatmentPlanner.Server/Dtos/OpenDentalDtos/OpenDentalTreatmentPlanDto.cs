namespace DentalTreatmentPlanner.Server.Dtos.OpenDentalDtos
{
    public class OpenDentalTreatmentPlanDto
    {
        public int PatNum { get; set; } // Patient Number in OpenDental
        public string ProcDate { get; set; }
        public List<OpenDentalProcedureDto> Procedures { get; set; } = new List<OpenDentalProcedureDto>();
    }
}
