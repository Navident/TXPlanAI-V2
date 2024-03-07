namespace DentalTreatmentPlanner.Server.Dtos
{
    public class LoginUserDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public bool RememberMe { get; set; } // for 'remember me' functionality
    }

}
