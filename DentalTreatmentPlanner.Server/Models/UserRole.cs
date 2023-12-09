namespace DentalTreatmentPlanner.Server.Models
{
    public class UserRole
    {
        public int UserRoleId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }

        public ICollection<User> Users { get; set; }
    }
}
