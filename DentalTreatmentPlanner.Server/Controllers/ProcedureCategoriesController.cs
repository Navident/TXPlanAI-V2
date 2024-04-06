using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using DentalTreatmentPlanner.Server.Data;
using DentalTreatmentPlanner.Server.Models;
using DentalTreatmentPlanner.Server.Dtos;
using DentalTreatmentPlanner.Server.Services;

namespace DentalTreatmentPlanner.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProcedureCategoryController : ControllerBase
    {
        private readonly DentalTreatmentPlannerService _service;

        public ProcedureCategoryController(DentalTreatmentPlannerService service)
        {
            _service = service;
        }

        [HttpGet("subcategories")]
        public async Task<ActionResult<IEnumerable<ProcedureSubCategoryDto>>> GetAllSubCategories()
        {
            try
            {
                var subCategories = await _service.GetAllSubCategoriesAsync(); 
                return Ok(subCategories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error");
            }
        }


        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<ProcedureCategoryDto>>> GetCategories()
        {
            try
            {
                var categories = await _service.GetAllCategoriesAsync();
                return Ok(categories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error");
            }
        }
    }
}

