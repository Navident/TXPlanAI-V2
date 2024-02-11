using DentalTreatmentPlanner.Server.Dtos;
using DentalTreatmentPlanner.Server.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Cryptography;


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

            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
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
                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, user.UserName),
                        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                        // ... other claims
                    };

                    // Generate a random key for HMACSHA256
                    //var randomKey = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32)); // 256 bits
                    var randomKey = "HK7RVoSagLhrSkJeNGpOTZTrvqMLboQAX5ZsY7Tv6Cs=";
                    Console.WriteLine($"Generated Key: {randomKey}");

                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(randomKey));
                    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                    var token = new JwtSecurityToken(
                        issuer: null,
                        audience: null,
                        claims: claims,
                        expires: DateTime.Now.AddMinutes(30),
                        signingCredentials: creds);


                    var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
                    Console.WriteLine($"Generated JWT token: {tokenString}");

                    return Ok(new { Token = tokenString, User = user, FacilityName = facilityName });
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
                return StatusCode(StatusCodes.Status500InternalServerError, new { isSuccess = false, Message = "An error occurred during login." });
            }
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _dentalTreatmentPlannerService.LogoutUserAsync();
            return Ok();
        }
    }
}
