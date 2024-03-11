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
using DentalTreatmentPlanner.Server.Models;
using Microsoft.AspNetCore.Identity;


namespace DentalTreatmentPlanner.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly DentalTreatmentPlannerService _dentalTreatmentPlannerService;
        private readonly UserManager<ApplicationUser> _userManager;

        public AccountController(DentalTreatmentPlannerService dentalTreatmentPlannerService, UserManager<ApplicationUser> userManager)
        {
            _dentalTreatmentPlannerService = dentalTreatmentPlannerService;
            _userManager = userManager;
        }

        private string GetUsernameFromToken()
        {
            var authorizationHeader = HttpContext.Request.Headers["Authorization"].ToString();

            if (string.IsNullOrEmpty(authorizationHeader) || !authorizationHeader.StartsWith("Bearer "))
            {
                return null;
            }

            var token = authorizationHeader.Substring("Bearer ".Length).Trim();
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadJwtToken(token);

            var usernameClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);
            return usernameClaim?.Value;
        }

        private async Task<int?> GetUserFacilityIdAsync()
        {
            var username = GetUsernameFromToken();
            if (string.IsNullOrEmpty(username))
            {
                return null;
            }

            var user = await _userManager.FindByNameAsync(username);
            return user?.FacilityId;
        }

        [HttpGet("customerkey")]
        public async Task<IActionResult> GetCustomerKey()
        {
            var facilityId = await GetUserFacilityIdAsync();
            if (!facilityId.HasValue)
            {
                return Unauthorized();
            }

            try
            {
                var customerKey = await _dentalTreatmentPlannerService.GetCustomerKeyByFacility(facilityId.Value);
                Console.WriteLine($"Customer key in controller method before returning to frontend: {customerKey}");
                return Ok(new { CustomerKey = customerKey });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error occurred during fetching customer key: {ex.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        [HttpPost("updatecustomerkey")]
        public async Task<IActionResult> UpdateCustomerKey([FromBody] UpdateCustomerKeyDto updateCustomerKeyDto)
        {
            // Obtain the facility ID for the current user
            var facilityId = await GetUserFacilityIdAsync();
            if (!facilityId.HasValue)
            {
                return Unauthorized();
            }

            try
            {
                // Attempt to update the customer key using the service layer method
                var success = await _dentalTreatmentPlannerService.UpdateCustomerKeyAsync(updateCustomerKeyDto.NewCustomerKey, facilityId.Value);

                if (success)
                {
                    return Ok(new { message = "Customer key updated successfully." });
                }
                else
                {
                    return NotFound(new { message = "Facility not found." });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error occurred during updating customer key: {ex.Message}");
                return StatusCode(500, "Internal Server Error");
            }
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
