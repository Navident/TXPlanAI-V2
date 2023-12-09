namespace DentalTreatmentPlanner.Server.Models
{
    public class CdtCodeSubcategory
    {
        public int CdtCodeSubcategoryId { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }

        public ICollection<CdtCode> CdtCodes { get; set; }
    }
}
