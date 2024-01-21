using DentalTreatmentPlanner.Server.Dtos;
using DentalTreatmentPlanner.Server.Models;
using DentalTreatmentPlanner.Server.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace DentalTreatmentPlanner.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly DentalTreatmentPlannerService _dentalService;
        private readonly UserManager<ApplicationUser> _userManager;

        public PatientController(DentalTreatmentPlannerService dentalService, UserManager<ApplicationUser> userManager)
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

        [HttpGet("facilityPatients")]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatientsForUserFacility()
        {
            var facilityId = await GetUserFacilityIdAsync();
            if (!facilityId.HasValue)
            {
                return Unauthorized();
            }

            var patients = await _dentalService.GetPatientsByFacility(facilityId.Value);
            return Ok(patients);
        }

        [HttpPost("create")]
        public async Task<ActionResult<int>> CreatePatient([FromBody] CreatePatientDto createPatientDto)
        {
            var facilityId = await GetUserFacilityIdAsync();
            if (!facilityId.HasValue)
            {
                return Unauthorized();
            }

            var newPatient = await _dentalService.CreatePatientAsync(createPatientDto, facilityId.Value);

            if (newPatient == null)
            {
                return BadRequest("Unable to create patient");
            }

            return Ok(newPatient.PatientId); // Return the patient ID
        }

    }

}
