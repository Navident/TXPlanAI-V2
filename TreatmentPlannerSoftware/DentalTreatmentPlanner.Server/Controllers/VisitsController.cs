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
using DentalTreatmentPlanner.Server.Dtos;

namespace DentalTreatmentPlanner.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VisitsController : Controller
    {
        private readonly DentalTreatmentPlannerService _dentalTreatmentPlannerService;

        public VisitsController(DentalTreatmentPlannerService dentalTreatmentPlannerService)
        {
            _dentalTreatmentPlannerService = dentalTreatmentPlannerService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateVisit([FromBody] CreateVisitDto createVisitDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _dentalTreatmentPlannerService.CreateVisitAsync(createVisitDto);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message); // Internal Server Error
            }
        }

        [HttpPost("CreateNewProcedures")]
        public async Task<IActionResult> CreateNewProcedures([FromBody] List<NewProcedureDto> newProcedures)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var result = await _dentalTreatmentPlannerService.CreateNewProceduresAsync(newProcedures);
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error occurred during new procedures creation: {ex}");
                return StatusCode(500, new { message = ex.Message, detail = ex.StackTrace });

            }
        }
    }
}
