using DentalTreatmentPlanner.Server.Dtos;
using DentalTreatmentPlanner.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace DentalTreatmentPlanner.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly DentalTreatmentPlannerService _dentalTreatmentPlannerService;

        public AccountController(DentalTreatmentPlannerService dentalTreatmentPlannerService)
        {
            _dentalTreatmentPlannerService = dentalTreatmentPlannerService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto registerUserDto)
        {
            var result = await _dentalTreatmentPlannerService.RegisterUserAsync(registerUserDto);

            if (result.Succeeded)
            {
                // Later, possibly need to create a user response DTO to send specific user details
                return Ok(new { isSuccess = true, message = "Registration successful" });
            }

            // Collect the errors into a list or a string
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            // Include an 'isSuccess' flag in the response for consistency
            return BadRequest(new { isSuccess = false, errors = errors });
        }



        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDto loginUserDto)
        {
            try
            {
                var (signInResult, user, facilityName) = await _dentalTreatmentPlannerService.LoginUserAsync(loginUserDto);

                if (signInResult.Succeeded)
                {
                    return Ok(new { isSuccess = true, User = user, FacilityName = facilityName });
                }

                if (signInResult.IsLockedOut)
                {
                    return StatusCode(StatusCodes.Status423Locked, new { isSuccess = false, Message = "User is locked out." });
                }
                else if (signInResult.IsNotAllowed)
                {
                    return BadRequest(new { isSuccess = false, Message = "User is not allowed to log in." });
                }
                else
                {
                    return Unauthorized(new { isSuccess = false, Message = "Invalid login attempt." });
                }
            }
            catch (Exception ex)
            {

                Console.WriteLine(ex.ToString());

                // Return a generic error message to the client
                return StatusCode(StatusCodes.Status500InternalServerError, new { isSuccess = false, Message = "An error occurred during login." });
            }
        }





        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _dentalTreatmentPlannerService.LogoutUserAsync();
            return Ok();
        }

        // Additional actions for password reset, change password, etc. can be added here
    }
}
