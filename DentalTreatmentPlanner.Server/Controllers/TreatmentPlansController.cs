using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DentalTreatmentPlanner.Server.Services;
using DentalTreatmentPlanner.Server.Dtos;

[ApiController]
[Route("api/[controller]")]
public class TreatmentPlansController : ControllerBase
{
    private readonly DentalTreatmentPlannerService _dentalTreatmentPlannerService;

    public TreatmentPlansController(DentalTreatmentPlannerService dentalTreatmentPlannerService)
    {
        _dentalTreatmentPlannerService = dentalTreatmentPlannerService;
    }

    // GET: api/TreatmentPlans
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TreatmentPlanDto>>> GetTreatmentPlans()
    {
        var treatmentPlans = await _dentalTreatmentPlannerService.GetTreatmentPlansAsync();
        return Ok(treatmentPlans);
    }

    // GET: api/TreatmentPlans/5
    [HttpGet("{id}")]
    public async Task<ActionResult<TreatmentPlanDto>> GetTreatmentPlan(int id)
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
    public async Task<ActionResult<TreatmentPlanDto>> CreateTreatmentPlan(TreatmentPlanDto treatmentPlanDto)
    {
        if (ModelState.IsValid)
        {
            var createdTreatmentPlan = await _dentalTreatmentPlannerService.CreateTreatmentPlanAsync(treatmentPlanDto);
            return CreatedAtAction(nameof(GetTreatmentPlan), new { id = createdTreatmentPlan.TreatmentPlanId }, createdTreatmentPlan);
        }
        return BadRequest(ModelState);
    }

    // Other actions like PUT (Edit) and DELETE can be added here later
}