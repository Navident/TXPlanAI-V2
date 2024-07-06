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
using Microsoft.AspNetCore.Identity;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace DentalTreatmentPlanner.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProcedureCategoryController : ControllerBase
    {
        private readonly DentalTreatmentPlannerService _service;
        private readonly UserManager<ApplicationUser> _userManager;

        public ProcedureCategoryController(DentalTreatmentPlannerService service, UserManager<ApplicationUser> userManager)
        {
            _service = service;
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

        [HttpGet("subcategories")]
        public async Task<ActionResult<IEnumerable<ProcedureSubCategoryDto>>> GetAllSubCategories()
        {
            try
            {
                var facilityId = await GetUserFacilityIdAsync();
                if (!facilityId.HasValue)
                {
                    return Unauthorized();
                }

                var subCategories = await _service.GetAllSubCategoriesAsync(facilityId.Value);
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
                var facilityId = await GetUserFacilityIdAsync();
                if (!facilityId.HasValue)
                {
                    return Unauthorized();
                }

                var categories = await _service.GetAllCategoriesAsync(facilityId.Value);
                return Ok(categories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error");
            }
        }
    }
}