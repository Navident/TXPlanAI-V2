namespace DentalTreatmentPlanner.Server.Dtos
{
    public class NewUcrFeeDto
    {
        public int CdtCodeId { get; set; }
        public decimal? UcrDollarAmount { get; set; }
        public decimal? CoveragePercent { get; set; }
        public decimal? DiscountFeeDollarAmount { get; set; }
    }

}
