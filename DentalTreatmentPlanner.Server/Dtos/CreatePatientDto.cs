namespace DentalTreatmentPlanner.Server.Dtos
{
    public class CreatePatientDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
    }

}
