namespace DentalTreatmentPlanner.Server.Dtos.OpenDentalDtos
{
    public class OpenDentalProcedureDto
    {
        public string ToothNum { get; set; } // Tooth Number
        public string? Surf { get; set; } // Surface
        public string ProcStatus { get; set; } = "TP"; // Procedure Status, defaulting to "TP" for Treatment Plan
        public string procCode { get; set; } // Procedure Code
        public string priority { get; set; } // Priority
        public string? ToothRange { get; set; } //// Tooth Range - only for fluoride treatments
    }
}
