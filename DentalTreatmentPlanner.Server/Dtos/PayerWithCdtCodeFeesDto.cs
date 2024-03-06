namespace DentalTreatmentPlanner.Server.Dtos
{
    public class PayerWithCdtCodeFeesDto
    {
        public int PayerId { get; set; }
        public string PayerName { get; set; }
        public List<CdtCodeFeeDto> CdtCodeFees { get; set; } = new List<CdtCodeFeeDto>();
    }

}
