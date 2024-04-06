using DentalTreatmentPlanner.Server.Dtos;
using DentalTreatmentPlanner.Server.Dtos.OpenDentalDtos;
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
    public class OpenDentalController : ControllerBase
    {
        private readonly OpenDentalService _openDentalService;
        private readonly UserManager<ApplicationUser> _userManager;

        public OpenDentalController(OpenDentalService openDentalService, UserManager<ApplicationUser> userManager)
        {
            _openDentalService = openDentalService;
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


        [HttpGet("facilityPatientsOpenDental")]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatientsForUserFacilityFromOpenDental()
        {
            var facilityId = await GetUserFacilityIdAsync();
            if (!facilityId.HasValue)
            {
                return Unauthorized();
            }

            var patients = await _openDentalService.GetAllPatientsByFacilityFromOpenDental(facilityId.Value);
            return Ok(patients);
        }


        [HttpPost("importtoopendental")]
        public async Task<IActionResult> ImportToOpenDental([FromBody] OpenDentalTreatmentPlanDto treatmentPlan)
        {
            var facilityId = await GetUserFacilityIdAsync();
            if (!facilityId.HasValue)
            {
                return Unauthorized();
            }

            try
            {
                var result = await _openDentalService.ImportToOpenDental(treatmentPlan, facilityId.Value);
                return Ok(new { message = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }



        [HttpPost("savePatientsFromOpenDentalToDatabase")]
        public async Task<IActionResult> SavePatientsFromOpenDentalToDatabase()
        {
            var facilityId = await GetUserFacilityIdAsync();
            if (!facilityId.HasValue)
            {
                return Unauthorized();
            }

            try
            {
                await _openDentalService.SavePatientsFromOpenDentalToDatabase(facilityId.Value);
                return Ok("Patients successfully saved to the database.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while saving patients from OpenDental.");
            }
        }

        [HttpPost("api/opendental/events")]
        public async Task<IActionResult> HandleOpenDentalEvent([FromBody] OpenDentalEventDto eventDto)
        {
            var facilityId = await GetUserFacilityIdAsync();
            if (!facilityId.HasValue)
            {
                return Unauthorized();
            }

            await _openDentalService.HandlePatientEvent(eventDto.PatientData, facilityId.Value);

            return Ok();
        }



    }

}
