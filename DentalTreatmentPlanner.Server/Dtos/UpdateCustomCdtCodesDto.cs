namespace DentalTreatmentPlanner.Server.Dtos
{
    public class UpdateCustomCdtCodesDto
    {
        public List<CreateCdtCodeDto> NewCdtCodes { get; set; }
        public List<EditCdtCodeDto> EditedCdtCodes { get; set; }
        public List<int> DeletedCdtCodeIds { get; set; }

        public UpdateCustomCdtCodesDto()
        {
            NewCdtCodes = new List<CreateCdtCodeDto>();
            DeletedCdtCodeIds = new List<int>();
        }
    }
}
