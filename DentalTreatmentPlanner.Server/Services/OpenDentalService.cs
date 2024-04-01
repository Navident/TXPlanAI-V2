using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System;
using DentalTreatmentPlanner.Server.Dtos.OpenDentalDtos;
using DentalTreatmentPlanner.Server.Models;
using Microsoft.EntityFrameworkCore;
using DentalTreatmentPlanner.Server.Data;
using Newtonsoft.Json;
using System.Text;
using DentalTreatmentPlanner.Server.Dtos;
using Azure;

namespace DentalTreatmentPlanner.Server.Services
{
    public class OpenDentalService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<OpenDentalService> _logger;
        private readonly IHttpClientFactory _httpClientFactory;

        // Hardcoded configuration settings - will need to update this later
        private readonly string _openDentalApiUrl = "https://api.opendental.com/api/v1";
        private readonly string _developerKey = "7MIiO8sGZaLc4hkE";

        public OpenDentalService(
            ApplicationDbContext context,
            ILogger<OpenDentalService> logger,
            IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _logger = logger;
            _httpClientFactory = httpClientFactory;
        }

        private HttpClient GetConfiguredHttpClient(string customerKey)
        {
            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("ODFHIR", $"{_developerKey}/{customerKey}");
            _logger.LogInformation($"Configured HttpClient Headers: {JsonConvert.SerializeObject(client.DefaultRequestHeaders)}");
            return client;
        }



        public async Task ImportToOpenDental(OpenDentalTreatmentPlanDto treatmentPlan, int facilityId)
        {
            // Retrieve the Facility to get the CustomerKey
            var facility = await _context.Facilities.FirstOrDefaultAsync(f => f.FacilityId == facilityId);
            if (facility == null || string.IsNullOrEmpty(facility.CustomerKey))
            {
                _logger.LogError($"Facility {facilityId} not found or lacks a customer key.");
                throw new InvalidOperationException($"Facility {facilityId} not found or lacks a customer key.");
            }

            var httpClient = GetConfiguredHttpClient(facility.CustomerKey);
            foreach (var procedure in treatmentPlan.Procedures)
            {
                var newProcedureData = new
                {
                    treatmentPlan.PatNum,
                    treatmentPlan.ProcDate,
                    procedure.ToothNum,
                    procedure.Surf,
                    procedure.ProcStatus,
                    procedure.procCode,
                    procedure.priority,
                    procedure.ToothRange
                };

                try
                {
                    var content = HttpClientExtensions.CreateJsonContentWithoutCharset(newProcedureData);

                    _logger.LogInformation($"Sending request to OpenDental API: {_openDentalApiUrl}/procedurelogs");


                    var response = await httpClient.PostAsync($"{_openDentalApiUrl}/procedurelogs", content);
                    if (response.IsSuccessStatusCode)
                    {
                        _logger.LogInformation($"Successfully imported procedure to OpenDental for PatNum: {treatmentPlan.PatNum}");
                    }
                    else
                    {
                        var errorContent = await response.Content.ReadAsStringAsync();
                        _logger.LogError($"Failed to import procedure to OpenDental. Status: {response.StatusCode}, Details: {errorContent}");
                        _logger.LogError($"Response Headers: {JsonConvert.SerializeObject(response.Headers)}");
                        _logger.LogError($"Request Content-Type: {content.Headers.ContentType}");
                    }

                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception occurred while importing procedure to OpenDental.");
                }
            }
        }



        public async Task<List<Patient>> GetAllPatientsByFacilityFromOpenDental(int facilityId)
        {
            // Retrieve the Facility to get the CustomerKey
            var facility = await _context.Facilities.FirstOrDefaultAsync(f => f.FacilityId == facilityId);
            if (facility == null || string.IsNullOrEmpty(facility.CustomerKey))
            {
                // Handle the case where the facility doesn't exist or doesn't have a CustomerKey
                _logger.LogError($"Facility {facilityId} not found or lacks a customer key.");
                return new List<Patient>();
            }

            var httpClient = GetConfiguredHttpClient(facility.CustomerKey);
            var apiUrl = $"{_openDentalApiUrl}/patients";

            try
            {
                var response = await httpClient.GetAsync(apiUrl);
                if (response.IsSuccessStatusCode)
                {
                    var patientsData = await response.Content.ReadFromJsonAsync<List<OpenDentalPatientDto>>();
                    var patients = patientsData.Select(p => new Patient
                    {
                        OpenDentalPatientId = p.PatNum,
                        FirstName = p.FName,
                        LastName = p.LName,
                        FacilityId = facilityId,
                    }).ToList();

                    return patients;
                }
                else
                {
                    _logger.LogError($"Failed to retrieve patients from OpenDental. Status: {response.StatusCode}");
                    return new List<Patient>();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception occurred while retrieving patients from OpenDental.");
                return new List<Patient>();
            }
        }

        public async Task<Patient> CreatePatientAsync(CreatePatientDto createPatientDto, int facilityId)
        {
            var newPatient = new Patient
            {
                FirstName = createPatientDto.FirstName,
                LastName = createPatientDto.LastName,
                DateOfBirth = createPatientDto.DateOfBirth,
                FacilityId = facilityId,
            };

            _context.Patients.Add(newPatient);
            await _context.SaveChangesAsync();

            return newPatient;
        }

        public async Task SavePatientsFromOpenDentalToDatabase(int facilityId)
        {
            var patientsFromOpenDental = await GetAllPatientsByFacilityFromOpenDental(facilityId);

            foreach (var patientDto in patientsFromOpenDental)
            {
                // Check if the patient already exists in the database to avoid duplication
                var existingPatient = await _context.Patients
                    .FirstOrDefaultAsync(p => p.OpenDentalPatientId == patientDto.OpenDentalPatientId && p.FacilityId == facilityId);

                if (existingPatient == null)
                {
                    var newPatient = new Patient
                    {
                        FirstName = patientDto.FirstName,
                        LastName = patientDto.LastName,
                        OpenDentalPatientId = patientDto.OpenDentalPatientId, 
                        FacilityId = facilityId,
                    };

                    _context.Patients.Add(newPatient);
                }
                else
                {
                    // Optionally, update the existing patient's details if necessary
                }
            }

            await _context.SaveChangesAsync();
        }

        public async Task HandlePatientEvent(OpenDentalPatientDto patientData, int facilityId)
        {
            try
            {
                var existingPatient = await _context.Patients
                                        .FirstOrDefaultAsync(p => p.OpenDentalPatientId == patientData.PatNum);

                if (existingPatient != null)
                {
                    // Update existing patient data
                    existingPatient.FirstName = patientData.FName;
                    existingPatient.LastName = patientData.LName;
                }
                else
                {
                    // Create a new patient record
                    var newPatient = new Patient
                    {
                        OpenDentalPatientId = patientData.PatNum,
                        FirstName = patientData.FName,
                        LastName = patientData.LName,
                        FacilityId = facilityId,
                    };
                    _context.Patients.Add(newPatient);
                }

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to handle patient event: {ex.Message}", ex);
                throw; 
            }
        }









    }
}
