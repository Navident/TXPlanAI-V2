namespace DentalTreatmentPlanner.Server.Dtos
{
    public class UpdateFacilityPayerCdtCodeFeesDto
    {
        public int PayerId { get; set; }
        public List<NewUcrFeeDto> NewFees { get; set; }
        public List<EditUcrFeeDto> UpdatedFees { get; set; }
        public EditPayerDto? EditedPayer { get; set; }
    }


}
