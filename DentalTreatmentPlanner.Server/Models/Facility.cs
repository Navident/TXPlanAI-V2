namespace DentalTreatmentPlanner.Server.Models
{
    public class Facility
    {
        public int FacilityId { get; set; }
        public string Name { get; set; } 
        public string Street { get; set; } 
        public string Suite { get; set; } 
        public string ZipCode { get; set; } 
        public string City { get; set; } 
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; } 

        //public ICollection<FacilityProviderMap> FacilityProviderMaps { get; set; }
        //public ICollection<CdtCode> CdtCodes { get; set; }
    }

}