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
using Microsoft.AspNetCore.Identity;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Newtonsoft.Json;

namespace DentalTreatmentPlanner.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CdtCodesController : Controller
    {
        private readonly DentalTreatmentPlannerService _dentalTreatmentPlannerService;
        private readonly UserManager<ApplicationUser> _userManager;

        public CdtCodesController(DentalTreatmentPlannerService dentalTreatmentPlannerService, UserManager<ApplicationUser> userManager)
        {
            _dentalTreatmentPlannerService = dentalTreatmentPlannerService;
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

        [HttpGet]
        [Route("defaultcdtcodes")]
        public async Task<IActionResult> GetAllDefaultCdtCodes()
        {
            try
            {
                Console.WriteLine("Starting to fetch all default CDT codes");
                var cdtCodes = await _dentalTreatmentPlannerService.GetAllDefaultCdtCodesAsync();
                Console.WriteLine($"Fetched {cdtCodes.Count()} default CDT codes");
                return Ok(cdtCodes);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error occurred while fetching default CDT codes: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("facilityCdtCodes")]
        public async Task<ActionResult<IEnumerable<CdtCode>>> GetCustomCdtCodesForFacility()
        {
            try
            {
                Console.WriteLine("Starting to fetch facility-specific CDT codes");
                var facilityId = await GetUserFacilityIdAsync();
                if (!facilityId.HasValue)
                {
                    Console.WriteLine("Unauthorized access attempt due to null facility ID");
                    return Unauthorized();
                }

                var cdtCodes = await _dentalTreatmentPlannerService.GetCustomCdtCodesByFacility(facilityId.Value);
                Console.WriteLine($"Fetched {cdtCodes.Count()} facility-specific CDT codes");
                return Ok(cdtCodes);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error occurred while fetching facility-specific CDT codes: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }




        [HttpGet("cdtCodesFees")]
        public async Task<ActionResult> GetFacilityPayerCdtCodesFees([FromQuery] int? payerId)
        {
            try
            {
                var facilityId = await GetUserFacilityIdAsync();
                // Check if a payerId was provided and call the service method accordingly
                if (payerId.HasValue)
                {
                    var fees = await _dentalTreatmentPlannerService.GetPayerCdtCodesFeesByFacilityAndPayer(facilityId.Value, payerId.Value);
                    Console.WriteLine("fees in GetFacilityPayerCdtCodesFees", fees);
                    return Ok(fees);
                }
                else
                {
                    Console.WriteLine("Payer doesnt have id!");
                    return StatusCode(500, "Internal server error");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error occurred while fetching fees for CDT codes: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }


        [HttpPut]
        [Route("updateFacilityPayerCdtCodeFees")]
        public async Task<IActionResult> UpdateFacilityPayerCdtCodeFees([FromBody] UpdateFacilityPayerCdtCodeFeesDto updateRequest)
        {
            try
            {
                Console.WriteLine("Starting to update facility payer CDT code fees");
                var facilityId = await GetUserFacilityIdAsync();

                if (!facilityId.HasValue)
                {
                    Console.WriteLine("Failed to retrieve facility ID");
                    return BadRequest("Failed to retrieve facility ID");
                }

                // Passing the entire updateRequest DTO which includes both NewFees and UpdatedFees, along with payerId
                var success = await _dentalTreatmentPlannerService.UpdateFacilityPayerCdtCodeFeesAsync(updateRequest, facilityId.Value);

                if (success)
                {
                    Console.WriteLine("Successfully updated facility payer CDT code fees");
                    return Ok();
                }
                else
                {
                    Console.WriteLine("Failed to update facility payer CDT code fees");
                    return StatusCode(500, "Internal server error");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error occurred while updating facility payer CDT code fees: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
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

        [HttpPost("updateCustomCdtCodes")]
        public async Task<IActionResult> UpdateCustomCdtCodes([FromBody] UpdateCustomCdtCodesDto updateCustomCdtCodesDto)
        {
            Console.WriteLine("Received DTO: " + JsonConvert.SerializeObject(updateCustomCdtCodesDto));

            var facilityId = await GetUserFacilityIdAsync();
            if (!facilityId.HasValue)
            {
                return Unauthorized();
            }

            var success = await _dentalTreatmentPlannerService.UpdateCustomCdtCodesAsync(updateCustomCdtCodesDto.NewCdtCodes, updateCustomCdtCodesDto.EditedCdtCodes, updateCustomCdtCodesDto.DeletedCdtCodeIds, facilityId.Value);
            if (success)
            {
                return Ok();
            }
            return BadRequest("Could not update CDT codes");
        }


    }
}
