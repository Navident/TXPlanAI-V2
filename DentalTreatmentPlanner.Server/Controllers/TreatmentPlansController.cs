﻿using System.Threading.Tasks;
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
            // Log the exception details
            return StatusCode(500, new { error = "Internal server error", details = ex.Message });
        }
    }
}


