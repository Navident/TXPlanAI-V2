namespace DentalTreatmentPlanner.Server.Dtos.OpenDentalDtos
{
    public class OpenDentalProcedureLogCreateRequest
    {
        public int PatNum { get; set; } //required
        public string ProcDate { get; set; } // required - yyyy-MM-dd
        public string ProcStatus { get; set; } // required TP, C, or EO
        public string procCode { get; set; } // required - always use D0150
        public int? AptNum { get; set; } // optional
        public decimal? ProcFee { get; set; } //optional
        public string Surf { get; set; } // optional for now
        public string ToothNum { get; set; } // optional for now
        public string ToothRange { get; set; } //optional for now
        //public int? Priority { get; set; } //optional 
        //public string priority { get; set; } //optional 
        public int? ProvNum { get; set; } //optional 
        public int? Dx { get; set; } //optional 
        public string dxName { get; set; } //optional 
        public int? PlannedAptNum { get; set; } //optional 
        public int? ClinicNum { get; set; } //optional 
    }
}
