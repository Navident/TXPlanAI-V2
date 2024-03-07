namespace DentalTreatmentPlanner.Server.Dtos
{
    public class RegisterUserDto
    {
        public string Email { get; set; } 
        public string PhoneNumber { get; set; } 
        public string BusinessName { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }

        // later will add more fields like FirstName, LastName, etc.
    }


}
