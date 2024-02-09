namespace DentalTreatmentPlanner.Server.Dtos
{
    public class EditUcrFeeDto
    {
        public string Code { get; set; }
        public int CdtCodeId { get; set; }
        public int UcrFeeId { get; set; }
        public decimal? UcrDollarAmount { get; set; }
        public decimal? DiscountFeeDollarAmount { get; set; }
    }
}
