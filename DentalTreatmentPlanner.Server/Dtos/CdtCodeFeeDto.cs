namespace DentalTreatmentPlanner.Server.Dtos
{
    public class CdtCodeFeeDto
    {
        public string Code { get; set; }
        public int CdtCodeId { get; set; } 
        public decimal? UcrDollarAmount { get; set; }
        public decimal? DiscountFeeDollarAmount { get; set; }
    }

}
