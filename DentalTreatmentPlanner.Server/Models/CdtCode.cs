namespace DentalTreatmentPlanner.Server.Models
{
    public class CdtCode
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

        public Facility Facility { get; set; }
        public CdtCodeCategory CdtCodeCategory { get; set; }
        public CdtCodeSubcategory CdtCodeSubcategory { get; set; }
        public ICollection<VisitCdtCodeMap> VisitCdtCodeMaps { get; set; }
        public ICollection<AlternativeProcedure> AlternativeProcedures { get; set; }
        public ICollection<ProcedureCategoryCdtCodeMap> ProcedureCategoryCdtCodeMaps { get; set; }

    }
}
