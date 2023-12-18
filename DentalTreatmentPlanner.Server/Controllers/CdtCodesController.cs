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
    public class CdtCodesController : Controller
    {
        private readonly DentalTreatmentPlannerService _dentalTreatmentPlannerService;

        public CdtCodesController(DentalTreatmentPlannerService dentalTreatmentPlannerService)
        {
            _dentalTreatmentPlannerService = dentalTreatmentPlannerService;
        }

        [HttpGet]
        [Route("api/cdtcodes")]
        public async Task<IActionResult> GetAllCdtCodes()
        {
            var cdtCodes = await _dentalTreatmentPlannerService.GetAllCdtCodesAsync();
            return Ok(cdtCodes);
        }
    }
}
