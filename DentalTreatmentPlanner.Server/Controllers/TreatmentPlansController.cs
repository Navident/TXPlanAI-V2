using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DentalTreatmentPlanner.Server.Services;
using DentalTreatmentPlanner.Server.Dtos;
using DentalTreatmentPlanner.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Newtonsoft.Json;
using DentalTreatmentPlanner.Server.Dtos.OpenDentalDtos;

[ApiController]
[Route("api/[controller]")]
public class TreatmentPlansController : ControllerBase
{
    private readonly DentalTreatmentPlannerService _dentalTreatmentPlannerService;
    private readonly UserManager<ApplicationUser> _userManager;

    public TreatmentPlansController(DentalTreatmentPlannerService dentalTreatmentPlannerService, UserManager<ApplicationUser> userManager)
    {
        _dentalTreatmentPlannerService = dentalTreatmentPlannerService;
        _userManager = userManager;
    }

    // GET: api/TreatmentPlans
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CreateTreatmentPlanDto>>> GetTreatmentPlans()
    {
        var treatmentPlans = await _dentalTreatmentPlannerService.GetTreatmentPlansAsync();
        return Ok(treatmentPlans);
    }

    // GET: api/TreatmentPlans/5
    [HttpGet("{id}")]
    public async Task<ActionResult<CreateTreatmentPlanDto>> GetTreatmentPlan(int id)
    {
        var treatmentPlan = await _dentalTreatmentPlannerService.GetTreatmentPlanAsync(id);

        if (treatmentPlan == null)
        {
            return NotFound();
        }

        return Ok(treatmentPlan);
    }




    // POST: api/TreatmentPlans
    [HttpPost]
    public async Task<ActionResult<CreateTreatmentPlanDto>> CreateTreatmentPlan(CreateTreatmentPlanDto treatmentPlanDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { error = "Invalid model state", details = ModelState });
        }

        try
        {
            var createdTreatmentPlan = await _dentalTreatmentPlannerService.CreateTreatmentPlanAsync(treatmentPlanDto);
            if (createdTreatmentPlan == null)
            {
                return BadRequest(new { error = "Failed to create treatment plan" });
            }

            return CreatedAtAction(nameof(GetTreatmentPlan), new { id = createdTreatmentPlan.TreatmentPlanId }, createdTreatmentPlan);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Internal server error", details = ex.Message });
        }
    }

    // PUT: api/TreatmentPlans/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTreatmentPlan(int id, UpdateTreatmentPlanDto updateTreatmentPlanDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (id != updateTreatmentPlanDto.TreatmentPlanId)
        {
            return BadRequest("ID mismatch");
        }

        try
        {
            var updatedTreatmentPlan = await _dentalTreatmentPlannerService.UpdateTreatmentPlanAsync(updateTreatmentPlanDto);

            if (updatedTreatmentPlan == null)
            {
                return NotFound();
            }

            return Ok(updatedTreatmentPlan);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Internal server error", details = ex.Message });
        }
    }

    // POST: api/TreatmentPlans/newfromdefault
    [HttpPost("newfromdefault")]
    public async Task<IActionResult> CreateNewTreatmentPlanFromDefault([FromBody] CreateNewTxPlanFromDefaultDto createNewTxPlanFromDefaultDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        string username = GetUsernameFromToken();
        if (string.IsNullOrEmpty(username))
        {
            return Unauthorized();
        }

        var user = await _userManager.FindByNameAsync(username);
        if (user == null)
        {
            return Unauthorized();
        }

        int? facilityId = user.FacilityId;
        if (!facilityId.HasValue)
        {
            return BadRequest("User's facility ID is not set.");
        }

        try
        {
            var newTreatmentPlan = await _dentalTreatmentPlannerService.CreateNewTreatmentPlanFromDefaultAsync(createNewTxPlanFromDefaultDto, facilityId.Value);
            if (newTreatmentPlan == null)
            {
                return NotFound();
            }

            return Ok(newTreatmentPlan);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Internal server error", details = ex.Message });
        }
    }




    // POST: api/TreatmentPlans/newTxForPatient
    [HttpPost("newTxForPatient")]
    public async Task<IActionResult> CreateNewTreatmentPlanWithoutEditsForPatient([FromBody] CreateUnmodifiedPatientTxDto createUnmodifiedPatientTxDto)
    {
        Console.WriteLine($"Received treatment plan DTO: {JsonConvert.SerializeObject(createUnmodifiedPatientTxDto)}");

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        string username = GetUsernameFromToken();
        if (string.IsNullOrEmpty(username))
        {
            return Unauthorized();
        }

        var user = await _userManager.FindByNameAsync(username);
        if (user == null)
        {
            return Unauthorized();
        }

        int? facilityId = user.FacilityId;
        if (!facilityId.HasValue)
        {
            // Handle the case where facilityId is null
            return BadRequest("User's facility ID is not set.");
        }

        try
        {
            var newTreatmentPlan = await _dentalTreatmentPlannerService.CreateNewTreatmentPlanForPatientFromCombinedAsync(createUnmodifiedPatientTxDto, facilityId.Value);
            if (newTreatmentPlan == null)
            {
                return NotFound();
            }

            return Ok(newTreatmentPlan);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Internal server error", details = ex.Message });
        }
    }

    // DELETE: api/TreatmentPlans/delete/{treatmentPlanId}
    [HttpDelete("delete/{treatmentPlanId}")]
    public async Task<IActionResult> DeleteTreatmentPlan(int treatmentPlanId)
    {
        string username = GetUsernameFromToken();
        if (string.IsNullOrEmpty(username))
        {
            return Unauthorized();
        }

        var user = await _userManager.FindByNameAsync(username);
        if (user == null)
        {
            return Unauthorized();
        }

        int? facilityId = user.FacilityId;
        if (!facilityId.HasValue)
        {
            return BadRequest("User's facility ID is not set.");
        }

        try
        {
            bool isDeleted = await _dentalTreatmentPlannerService.DeleteTreatmentPlanByIdAsync(treatmentPlanId);

            if (isDeleted)
            {
                return Ok(new { message = "Treatment plan deleted successfully." });
            }
            else
            {
                return NotFound(new { message = "Treatment plan not found or user does not have permission to delete it." });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Internal server error", details = ex.Message });
        }
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


    // GET: api/TreatmentPlans/Subcategory/5
    [HttpGet("Subcategory/{subcategoryName}")]
    public async Task<ActionResult<IEnumerable<RetrieveTreatmentPlanDto>>> GetTreatmentPlansBySubcategory(string subcategoryName)
    {
        string username = GetUsernameFromToken();
        if (string.IsNullOrEmpty(username))
        {
            return Unauthorized();
        }

        var user = await _userManager.FindByNameAsync(username);
        if (user == null)
        {
            return Unauthorized();
        }

        var treatmentPlans = await _dentalTreatmentPlannerService.GetTreatmentPlansBySubcategoryAsync(subcategoryName, user.FacilityId);
        if (treatmentPlans == null || !treatmentPlans.Any())
        {
            return NotFound();
        }

        return Ok(treatmentPlans);
    }

    // GET: api/TreatmentPlans/Patient/5
    [HttpGet("Patient/{patientId}")]
    public async Task<ActionResult<IEnumerable<RetrieveTreatmentPlanDto>>> GetTreatmentPlansByPatient(int patientId)
    {
        string username = GetUsernameFromToken();
        if (string.IsNullOrEmpty(username))
        {
            return Unauthorized();
        }

        var user = await _userManager.FindByNameAsync(username);
        if (user == null)
        {
            return Unauthorized();
        }

        var treatmentPlans = await _dentalTreatmentPlannerService.GetTreatmentPlansByPatientIdAsync(patientId, user.FacilityId);
        if (treatmentPlans == null || !treatmentPlans.Any())
        {
            return NotFound();
        }

        return Ok(treatmentPlans);
    }

    // GET: api/TreatmentPlans/allpatientplansforfacility
    [HttpGet("allpatientplansforfacility")]
    public async Task<IActionResult> GetAllTreatmentPlansForFacility()
    {
        string username = GetUsernameFromToken();
        if (string.IsNullOrEmpty(username))
        {
            return Unauthorized();
        }

        var user = await _userManager.FindByNameAsync(username);
        if (user == null)
        {
            return Unauthorized();
        }

        if (!user.FacilityId.HasValue)
        {
            return BadRequest("User's facility ID is not set.");
        }

        try
        {
            var treatmentPlans = await _dentalTreatmentPlannerService.GetAllPatientTreatmentPlansForFacilityAsync(user.FacilityId.Value);
            return Ok(treatmentPlans);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Internal server error", details = ex.Message });
        }
    }


}



