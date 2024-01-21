using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using DentalTreatmentPlanner.Server.Data;
using DentalTreatmentPlanner.Server.Models;
using DentalTreatmentPlanner.Server.Services;

namespace DentalTreatmentPlanner.Server.Controllers
{
    public class TreatmentPhaseController : Controller
    {
        private readonly DentalTreatmentPlannerService _dentalTreatmentPlannerService;

        public TreatmentPhaseController(DentalTreatmentPlannerService dentalTreatmentPlannerService)
        {
            _dentalTreatmentPlannerService = dentalTreatmentPlannerService;
        }

        [HttpGet]
        [Route("api/treatmentphases")]
        public async Task<IActionResult> GetAllTreatmentPhases()
        {
            var treatmentPhases = await _dentalTreatmentPlannerService.GetAllTreatmentPhasesAsync();
            return Ok(treatmentPhases);
        }
    }
}
