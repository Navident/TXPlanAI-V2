namespace DentalTreatmentPlanner.Server.Models
{
    public class Patient
    {
        public Patient()
        {
            TreatmentPlans = new List<TreatmentPlan>();
            CreatedAt = DateTime.UtcNow;
        }

        public int PatientId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }  
        public int FacilityId { get; set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime? ModifiedAt { get; set; }

        public virtual Facility Facility { get; set; }
        public ICollection<TreatmentPlan> TreatmentPlans { get; set; }
    }
}
