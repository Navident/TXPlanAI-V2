namespace DentalTreatmentPlanner.Server.Dtos.OpenDentalDtos
{
    public class OpenDentalProcNoteCreateRequest
    {
        public int PatNum { get; set; } // Required
        public int ProcNum { get; set; } // Required
        public string Note { get; set; } // Required
    }

}
