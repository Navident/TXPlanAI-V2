namespace DentalTreatmentPlanner.Server.Dtos
{
    public class CdtCodeDto
    {
        public int CdtCodeId { get; set; }
        public string Code { get; set; }
        public int FacilityId { get; set; }
        public int CdtCodeCategoryId { get; set; }
        public int CdtCodeSubcategoryId { get; set; }
        public string LongDescription { get; set; }
        public string ShortDescription { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }

    }
}

