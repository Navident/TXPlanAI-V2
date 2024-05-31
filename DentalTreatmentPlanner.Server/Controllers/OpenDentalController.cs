using DentalTreatmentPlanner.Server.Dtos;
using DentalTreatmentPlanner.Server.Dtos.OpenDentalDtos;
using DentalTreatmentPlanner.Server.Models;
using DentalTreatmentPlanner.Server.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Json;

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

        [HttpPost("procedurelogs")]
        public async Task<IActionResult> CreateProcedureLog([FromBody] OpenDentalProcedureLogCreateRequest request)
        {
            var facilityId = await GetUserFacilityIdAsync();
            if (!facilityId.HasValue)
            {
                return Unauthorized();
            }

            try
            {
                var requestPayload = System.Text.Json.JsonSerializer.Serialize(request, new JsonSerializerOptions { WriteIndented = true });
                Console.WriteLine($"Received request to create procedure log with payload: {requestPayload}");

                var response = await _openDentalService.CreateProcedureLog(request, facilityId.Value);
                return CreatedAtAction(nameof(CreateProcedureLog), new { id = response.ProcNum }, response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating procedure log: {ex}");
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("procnotes")]
        public async Task<IActionResult> CreateProcNote([FromBody] OpenDentalProcNoteCreateRequest request)
        {
            var facilityId = await GetUserFacilityIdAsync();
            if (!facilityId.HasValue)
            {
                return Unauthorized();
            }

            try
            {
                var requestPayload = System.Text.Json.JsonSerializer.Serialize(request, new JsonSerializerOptions { WriteIndented = true });
                Console.WriteLine($"Received request to create procedure note with payload: {requestPayload}");

                await _openDentalService.CreateProcNoteAsync(request, facilityId.Value);
                return CreatedAtAction(nameof(CreateProcNote), new { PatNum = request.PatNum, ProcNum = request.ProcNum }, request);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating procedure note: {ex}");
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("allergies/{patNum}")]
        public async Task<ActionResult<IEnumerable<OpenDentalAllergiesDto>>> GetAllergiesForPatient(int patNum)
        {
            var facilityId = await GetUserFacilityIdAsync();
            if (!facilityId.HasValue)
            {
                return Unauthorized();
            }

            try
            {
                var allergies = await _openDentalService.GetAllergiesForPatient(patNum, facilityId.Value);
                if (!allergies.Any())
                {
                    return NotFound("No allergies found for this patient.");
                }
                return Ok(allergies);
            }
            catch (Exception ex)
            {
                //_logger.LogError(ex, "Failed to retrieve allergies.");
                return StatusCode(500, "Internal server error while retrieving allergies.");
            }
        }


        [HttpGet("diseases/{patNum}")]
        public async Task<ActionResult<IEnumerable<OpenDentalDiseasesDto>>> GetDiseasesForPatient(int patNum)
        {
            var facilityId = await GetUserFacilityIdAsync();
            if (!facilityId.HasValue)
            {
                return Unauthorized();
            }

            try
            {
                var diseases = await _openDentalService.GetDiseasesForPatient(patNum, facilityId.Value);
                if (!diseases.Any())
                {
                    return NotFound("No diseases found for this patient.");
                }
                return Ok(diseases);
            }
            catch (Exception ex)
            {
                //_logger.LogError(ex, "Failed to retrieve diseases.");
                return StatusCode(500, "Internal server error while retrieving diseases.");
            }
        }

        [HttpGet("medications/{patNum}")]
        public async Task<ActionResult<IEnumerable<OpenDentalMedicationPatDto>>> GetMedicationsForPatient(int patNum)
        {
            var facilityId = await GetUserFacilityIdAsync();
            if (!facilityId.HasValue)
            {
                return Unauthorized();
            }

            try
            {
                var medications = await _openDentalService.GetMedicationsForPatient(patNum, facilityId.Value);
                if (!medications.Any())
                {
                    return NotFound("No medications found for this patient.");
                }
                return Ok(medications);
            }
            catch (Exception ex)
            {
                //_logger.LogError(ex, "Failed to retrieve medications.");
                return StatusCode(500, "Internal server error while retrieving medications.");
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
