using DentalTreatmentPlanner.Server.Models;

public class UcrFee
{
    public UcrFee()
    {
        CreatedAt = DateTime.UtcNow;
    }

    public int UcrFeeId { get; set; }
    public int PayerFacilityMapId { get; set; }
    public int CdtCodeId { get; set; }
    public decimal? UcrDollarAmount { get; set; }

    public decimal? CoveragePercent { get; set; }

    public decimal? CoPay { get; set; }

    public DateTime CreatedAt { get; private set; }
    public DateTime? ModifiedAt { get; set; }

    public PayerFacilityMap PayerFacilityMap { get; set; }
    public CdtCode CDTCode { get; set; }
}
