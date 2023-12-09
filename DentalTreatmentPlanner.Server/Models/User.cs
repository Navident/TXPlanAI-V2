namespace DentalTreatmentPlanner.Server.Models
{
    public class User
    {
        public int UserId { get; set; }
        public int UserRoleId { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public DateTime? LastLogin { get; set; }
        public bool Disabled { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }

        public UserRole UserRole { get; set; }
        public ICollection<TreatmentPlan> CreatedTreatmentPlans { get; set; }
        public ICollection<Visit> CreatedVisits { get; set; }
    }
}
