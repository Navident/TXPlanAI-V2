namespace DentalTreatmentPlanner.Server.Dtos
{
    public class CreateUnmodifiedPatientTxDto
    {
        //public string Description { get; set; }
        public int? ProcedureSubcategoryId { get; set; }
        public int? ToothNumber { get; set; }
        public int PatientId { get; set; }
        public int? PayerId { get; set; }
        public ICollection<CreatePatientVisitDto> Visits { get; set; }
    }
}
