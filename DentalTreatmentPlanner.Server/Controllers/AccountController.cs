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
                // Later, you can create a user response DTO to send specific user details
                // Return camelCase property names for consistency
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
            var (signInResult, user) = await _dentalTreatmentPlannerService.LoginUserAsync(loginUserDto);

            if (signInResult.Succeeded)
            {
                return Ok(new { isSuccess = true, message = "Login successful", businessName = user?.BusinessName });
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




        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _dentalTreatmentPlannerService.LogoutUserAsync();
            return Ok();
        }

        // Additional actions for password reset, change password, etc. can be added here
    }
}
