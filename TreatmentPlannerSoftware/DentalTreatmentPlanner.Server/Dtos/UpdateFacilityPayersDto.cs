namespace DentalTreatmentPlanner.Server.Dtos
{

    public class PayerDto
    {
        public int PayerId { get; set; }
        public string PayerName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
    }

    public class UpdateFacilityPayersDto
    {
        public List<CreatePayerDto> NewPayers { get; set; } = new List<CreatePayerDto>();
        public List<EditPayerDto> EditedPayers { get; set; } = new List<EditPayerDto>();
        public List<int> DeletedPayerIds { get; set; } = new List<int>();
    }


    public class CreatePayerDto
    {
        public string PayerName { get; set; }
    }

    public class EditPayerDto
    {
        public int Id { get; set; }
        public string PayerName { get; set; }
    }

}
