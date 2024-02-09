using DentalTreatmentPlanner.Server.Dtos;
using DentalTreatmentPlanner.Server.Models;
using DentalTreatmentPlanner.Server.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace DentalTreatmentPlanner.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PayerController : ControllerBase
    {
        private readonly DentalTreatmentPlannerService _dentalService;
        private readonly UserManager<ApplicationUser> _userManager;

        public PayerController(DentalTreatmentPlannerService dentalService, UserManager<ApplicationUser> userManager)
        {
            _dentalService = dentalService;
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


        [HttpPost("updateFacilityPayers")]
        public async Task<IActionResult> UpdateFacilityPayers([FromBody] UpdateFacilityPayersDto updateFacilityPayersDto)
        {
            Console.WriteLine("Received Payer Update DTO: " + JsonConvert.SerializeObject(updateFacilityPayersDto));

            var facilityId = await GetUserFacilityIdAsync();
            if (!facilityId.HasValue)
            {
                return Unauthorized();
            }

            var success = await _dentalService.UpdateFacilityPayersAsync(updateFacilityPayersDto.NewPayers, updateFacilityPayersDto.EditedPayers, updateFacilityPayersDto.DeletedPayerIds, facilityId.Value);
            if (success)
            {
                return Ok();
            }
            return BadRequest("Could not update payer information");
        }

        [HttpGet("facilityPayers")]
        public async Task<IActionResult> GetFacilityPayers()
        {
            var facilityId = await GetUserFacilityIdAsync();
            if (!facilityId.HasValue)
            {
                return Unauthorized();
            }

            try
            {
                var payers = await _dentalService.GetFacilityPayersAsync(facilityId.Value);
                return Ok(payers);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error occurred during fetching facility payers: {ex.Message}");
                return StatusCode(500, "Internal Server Error");
            }
        }


    }

}
