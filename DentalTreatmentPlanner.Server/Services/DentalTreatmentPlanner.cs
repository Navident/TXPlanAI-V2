﻿using DentalTreatmentPlanner.Server.Data;
using DentalTreatmentPlanner.Server.Models;
using DentalTreatmentPlanner.Server.Dtos;

using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System.Net.Http;
using System.Net.Http.Headers;
using static System.Net.WebRequestMethods;

namespace DentalTreatmentPlanner.Server.Services
{
    public class DentalTreatmentPlannerService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ILogger<DentalTreatmentPlannerService> _logger;

        public DentalTreatmentPlannerService(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ILogger<DentalTreatmentPlannerService> logger
        )
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
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

        public async Task<CdtCode> CreateCustomCdtCodeAsync(CreateCdtCodeDto createCdtCodeDto, int facilityId)
        {
            var newCdtCode = new CdtCode
            {
                Code = createCdtCodeDto.Code,
                LongDescription = createCdtCodeDto.LongDescription,
                FacilityId = facilityId
            };

            _context.CdtCodes.Add(newCdtCode);
            await _context.SaveChangesAsync();

            return newCdtCode;
        }


        public async Task<bool> UpdateCustomerKeyAsync(string? newCustomerKey, int facilityId)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var facility = await _context.Facilities.FindAsync(facilityId);
                    if (facility != null)
                    {
                        // Update the customer key. If newCustomerKey is null, it "deletes" the customer key.
                        facility.CustomerKey = newCustomerKey;
                        _context.Facilities.Update(facility);
                        await _context.SaveChangesAsync();
                        await transaction.CommitAsync();
                    }
                    else
                    {
                        Console.WriteLine($"Facility with ID: {facilityId} not found.");
                        await transaction.RollbackAsync();
                        return false; // Facility not found
                    }
                    return true;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error occurred during updating the customer key: {ex.Message}");
                    await transaction.RollbackAsync();
                    return false;
                }
            }
        }


        public async Task<bool> UpdateCustomCdtCodesAsync(List<CreateCdtCodeDto> newCdtCodes, List<EditCdtCodeDto> editedCdtCodes, List<int> deletedCdtCodeIds, int facilityId)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    // Handle creation of new CDT codes
                    foreach (var dto in newCdtCodes)
                    {
                        var newCdtCode = new CdtCode
                        {
                            Code = dto.Code,
                            LongDescription = dto.LongDescription,
                            FacilityId = facilityId
                        };
                        _context.CdtCodes.Add(newCdtCode);
                    }

                    // Handle deletion of CDT codes
                    foreach (var id in deletedCdtCodeIds)
                    {
                        var cdtCode = await _context.CdtCodes.FindAsync(id);
                        if (cdtCode != null)
                        {
                            _context.CdtCodes.Remove(cdtCode);
                        }
                        else
                        {
                            Console.WriteLine($"CDT code with ID: {id} not found for deletion.");
                        }
                    }

                    // Handle updating of CDT codes
                    foreach (var dto in editedCdtCodes)
                    {
                        var cdtCode = await _context.CdtCodes.FindAsync(dto.Id);
                        if (cdtCode != null)
                        {
                            cdtCode.Code = dto.Code;
                            cdtCode.LongDescription = dto.LongDescription;
                        }
                    }

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                    return true;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error occurred during updating CDT codes: {ex.Message}");
                    await transaction.RollbackAsync();
                    return false;
                }
            }
        }

        public async Task<IEnumerable<PayerDto>> GetFacilityPayersAsync(int facilityId)
        {
            // Fetching payers that are mapped to the specified facility
            return await _context.PayerFacilityMaps
                .Where(pfm => pfm.FacilityId == facilityId)
                .Include(pfm => pfm.Payer)
                .Select(pfm => new PayerDto
                {
                    PayerId = pfm.Payer.PayerId,
                    PayerName = pfm.Payer.PayerName,
                    CreatedAt = pfm.Payer.CreatedAt,
                    ModifiedAt = pfm.Payer.ModifiedAt
                })
                .ToListAsync();
        }


        public async Task<bool> UpdateFacilityPayersAsync(List<CreatePayerDto> newPayers, List<EditPayerDto> editedPayers, List<int> deletedPayerIds, int facilityId)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    // Handle creation of new payers
                    foreach (var dto in newPayers)
                    {
                        var newPayer = new Payer
                        {
                            PayerName = dto.PayerName
                        };
                        _context.Payers.Add(newPayer);
                        await _context.SaveChangesAsync();

                        var payerFacilityMap = new PayerFacilityMap
                        {
                            PayerId = newPayer.PayerId,
                            FacilityId = facilityId
                        };
                        _context.PayerFacilityMaps.Add(payerFacilityMap);
                    }

                    // Handle updating of payers
                    foreach (var dto in editedPayers)
                    {
                        var payer = await _context.Payers.FindAsync(dto.Id);
                        if (payer != null)
                        {
                            payer.PayerName = dto.PayerName;
                            payer.ModifiedAt = DateTime.UtcNow;
                        }
                    }

                    // Handle deletion of payers
                    foreach (var id in deletedPayerIds)
                    {
                        var payer = await _context.Payers.FindAsync(id);
                        if (payer != null)
                        {
                            _context.Payers.Remove(payer);
                            // Also remove associated PayerFacilityMap entries
                            var payerFacilityMaps = _context.PayerFacilityMaps.Where(pfm => pfm.PayerId == id);
                            _context.PayerFacilityMaps.RemoveRange(payerFacilityMaps);
                        }
                    }

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                    return true;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error occurred during updating payers: {ex.Message}");
                    await transaction.RollbackAsync();
                    return false;
                }
            }
        }

        public async Task<bool> UpdateFacilityPayerCdtCodeFeesAsync(UpdateFacilityPayerCdtCodeFeesDto updateRequest, int facilityId)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var payer = await _context.Payers.FindAsync(updateRequest.PayerId);
                    if (payer == null)
                    {
                        Console.WriteLine($"Error occurred, payer with ID {updateRequest.PayerId} not found.");
                        return false;
                    }

                    // Update the payer name if it has been edited and provided in the request
                    if (updateRequest.EditedPayer != null)
                    {
                        payer.PayerName = updateRequest.EditedPayer.PayerName;
                    }

                    // Attempt to find or create a PayerFacilityMap
                    var payerFacilityMap = await _context.PayerFacilityMaps
                        .FirstOrDefaultAsync(pfm => pfm.PayerId == updateRequest.PayerId && pfm.FacilityId == facilityId);

                    if (payerFacilityMap == null)
                    {
                        payerFacilityMap = new PayerFacilityMap { PayerId = updateRequest.PayerId, FacilityId = facilityId };
                        _context.PayerFacilityMaps.Add(payerFacilityMap);
                        await _context.SaveChangesAsync();
                    }

                    // Handle new fees
                    foreach (var newFee in updateRequest.NewFees)
                    {
                        var existingUcrFee = await _context.UcrFees
                            .FirstOrDefaultAsync(uf => uf.CdtCodeId == newFee.CdtCodeId && uf.PayerFacilityMapId == payerFacilityMap.PayerFacilityMapId);

                        if (existingUcrFee != null) // If an existing UcrFee is found, update it
                        {
                            existingUcrFee.UcrDollarAmount = newFee.UcrDollarAmount;
                            existingUcrFee.CoveragePercent = newFee.CoveragePercent;
                            existingUcrFee.ModifiedAt = DateTime.UtcNow;
                        }
                        else // Otherwise, create a new UcrFee
                        {
                            var newUcrFee = new UcrFee
                            {
                                PayerFacilityMapId = payerFacilityMap.PayerFacilityMapId,
                                CdtCodeId = newFee.CdtCodeId,
                                UcrDollarAmount = newFee.UcrDollarAmount,
                                CoveragePercent = newFee.CoveragePercent,
                            };
                            _context.UcrFees.Add(newUcrFee);
                        }
                    }
                    // Handle updated fees
                    foreach (var updatedFee in updateRequest.UpdatedFees)
                    {
                        var existingUcrFee = await _context.UcrFees.FirstOrDefaultAsync(uf => uf.UcrFeeId == updatedFee.UcrFeeId);
                        if (existingUcrFee != null) // Ensure the UcrFee exists before attempting to update
                        {
                            existingUcrFee.UcrDollarAmount = updatedFee.UcrDollarAmount;
                            existingUcrFee.CoveragePercent = updatedFee.CoveragePercent;
                            existingUcrFee.ModifiedAt = DateTime.UtcNow;
                        }
                        {
                            Console.WriteLine($"Error occurred, there was no existing UCR fee found in the database for the updatedFee with ID {updatedFee.UcrFeeId}.");
                        }
                    }

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                    return true;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error occurred during updating facility payer CDT code fees: {ex.Message}");
                    await transaction.RollbackAsync();
                    return false;
                }
            }
        }




        public async Task<List<CdtCodeFeeDto>> GetPayerCdtCodesFeesByFacilityAndPayer(int facilityId, int payerId)
        {
            return await _context.UcrFees
                .Where(uf => (uf.CDTCode.FacilityId == null || uf.CDTCode.FacilityId == facilityId) &&
                             uf.PayerFacilityMap.FacilityId == facilityId &&
                             uf.PayerFacilityMap.PayerId == payerId)
                .Select(uf => new CdtCodeFeeDto
                {
                    Code = uf.CDTCode.Code,
                    CdtCodeId = uf.CDTCode.CdtCodeId,
                    UcrDollarAmount = uf.UcrDollarAmount,
                    CoveragePercent = uf.CoveragePercent,
                    // Calculate CoPay 
                    CoPay = uf.UcrDollarAmount.HasValue && uf.CoveragePercent.HasValue
                        ? uf.UcrDollarAmount.Value - (uf.UcrDollarAmount.Value * (uf.CoveragePercent.Value / 100))
                        : (decimal?)null
                }).ToListAsync();
        }


        public async Task<IEnumerable<PayerWithCdtCodeFeesDto>> GetFacilityPayersWithCdtCodesFeesAsync(int facilityId)
        {
            var payersWithFees = await _context.PayerFacilityMaps
                .Where(pfm => pfm.FacilityId == facilityId)
                .Include(pfm => pfm.Payer)
                .Select(pfm => new PayerWithCdtCodeFeesDto
                {
                    PayerId = pfm.Payer.PayerId,
                    PayerName = pfm.Payer.PayerName,
                    CdtCodeFees = _context.UcrFees
                        .Where(uf => (uf.CDTCode.FacilityId == null || uf.CDTCode.FacilityId == facilityId) &&
                                     uf.PayerFacilityMapId == pfm.PayerFacilityMapId)
                        .Select(uf => new CdtCodeFeeDto
                        {
                            Code = uf.CDTCode.Code,
                            CdtCodeId = uf.CDTCode.CdtCodeId,
                            UcrDollarAmount = uf.UcrDollarAmount,
                            CoveragePercent = uf.CoveragePercent,
                            CoPay = uf.UcrDollarAmount.HasValue && uf.CoveragePercent.HasValue
                                ? uf.UcrDollarAmount.Value - (uf.UcrDollarAmount.Value * (uf.CoveragePercent.Value / 100))
                                : (decimal?)null
                        }).ToList()
                })
                .ToListAsync();

            return payersWithFees;
        }


        public async Task<List<Patient>> GetAllPatientsByFacility(int facilityId)
        {
            return await _context.Patients.Where(p => p.FacilityId == facilityId).ToListAsync();
        }



        public async Task<List<CdtCode>> GetCustomCdtCodesByFacility(int facilityId)
        {
            return await _context.CdtCodes.Where(c => c.FacilityId == facilityId).ToListAsync();
        }

        public async Task<string> GetCustomerKeyByFacility(int facilityId)
        {
            var facility = await _context.Facilities
                                          .Where(f => f.FacilityId == facilityId)
                                          .Select(f => f.CustomerKey)
                                          .FirstOrDefaultAsync();

            return facility;
        }





        public async Task<IdentityResult> RegisterUserAsync(RegisterUserDto registerUserDto)
        {
            if (registerUserDto.Password != registerUserDto.ConfirmPassword)
            {
                Console.WriteLine("Passwords do not match");
                return IdentityResult.Failed(new IdentityError { Description = "Passwords do not match" });
            }

            // Create a new facility instance
            var facility = new Facility
            {
                Name = registerUserDto.BusinessName
            };

            // Save the facility to the database
            _context.Facilities.Add(facility);
            await _context.SaveChangesAsync();
            Console.WriteLine($"Facility created with ID: {facility.FacilityId}");

            // Create a new ApplicationUser instance
            var user = new ApplicationUser
            {
                UserName = registerUserDto.Email,
                Email = registerUserDto.Email,
                PhoneNumber = string.IsNullOrWhiteSpace(registerUserDto.PhoneNumber) ? null : registerUserDto.PhoneNumber,
                FacilityId = facility.FacilityId
            };

            // Create the user
            var result = await _userManager.CreateAsync(user, registerUserDto.Password);

            if (result.Succeeded)
            {
                Console.WriteLine($"User created successfully with email: {user.Email}");

                // Explicitly check and log if the user has a FacilityId
                var createdUser = await _userManager.FindByEmailAsync(registerUserDto.Email);
                if (createdUser != null && createdUser.FacilityId.HasValue)
                {
                    Console.WriteLine($"User with email {createdUser.Email} is associated with Facility ID: {createdUser.FacilityId}");
                }
                else
                {
                    Console.WriteLine($"User with email {createdUser.Email} does not have an associated Facility ID.");
                }
            }
            else
            {
                Console.WriteLine($"User creation failed: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }

            return result;
        }

        public async Task<(Microsoft.AspNetCore.Identity.SignInResult, ApplicationUser, string, bool)> LoginUserAsync(LoginUserDto loginUserDto)
        {
            var result = await _signInManager.PasswordSignInAsync(loginUserDto.Email, loginUserDto.Password, loginUserDto.RememberMe, lockoutOnFailure: false);

            if (result.Succeeded)
            {
                var user = await _userManager.FindByEmailAsync(loginUserDto.Email);

                //check if this user is a superadmin
                var isSuperAdmin = await _userManager.IsInRoleAsync(user, "SuperAdmin");
                // Log the user's email and FacilityId
                Console.WriteLine($"User logged in with email: {user?.Email}, FacilityId: {user?.FacilityId}");

                string facilityName = null;

                // Check if the FacilityId is not null
                if (user?.FacilityId != null)
                {
                    var facility = await _context.Facilities.FindAsync(user.FacilityId);
                    if (facility != null) // Check if the facility is not null
                    {
                        facilityName = facility.Name;
                        Console.WriteLine($"Facility found with ID: {facility.FacilityId}, Name: {facility.Name}");
                    }
                    else
                    {
                        Console.WriteLine($"No facility found for FacilityId: {user.FacilityId}");
                    }
                }
                else
                {
                    Console.WriteLine($"FacilityId is null for user with email: {user?.Email}");
                }

                return (result, user, facilityName, isSuperAdmin); // Return the sign-in result, user details, facility name, superadmin status
            }
            else
            {
                Console.WriteLine($"Login failed for user with email: {loginUserDto.Email}");
                return (result, null, null, false);
            }
        }

        public async Task LogoutUserAsync()
        {
            await _signInManager.SignOutAsync();
        }



        // Method to retrieve a treatment plan by a treatment plan id
        public async Task<RetrieveTreatmentPlanDto> GetTreatmentPlanAsync(int treatmentPlanId)
        {
            // Querying the database for a specific treatment plan based on its ID
            var treatmentPlan = await _context.TreatmentPlans
                .Where(tp => tp.TreatmentPlanId == treatmentPlanId)
                .Select(tp => new RetrieveTreatmentPlanDto
                {
                    TreatmentPlanId = tp.TreatmentPlanId,
                    PayerId = tp.PayerId,
                    Description = tp.Description,
                    ProcedureSubcategoryId = tp.ProcedureSubcategoryId,

                    // Mapping each visit of the treatment plan to a VisitDto
                    Visits = tp.Visits.Select(v => new RetrieveVisitDto
                    {
                        VisitId = v.VisitId,
                        Description = v.Description,
                        VisitNumber = v.VisitNumber,

                        // Now mapping procedures and CDT codes for each visit
                        Procedures = v.VisitToProcedureMaps.Select(vp => new VisitToProcedureMapDto
                        {
                            ProcedureTypeId = vp.ProcedureTypeId,
                            Order = vp.Order,
                            ToothNumber = vp.ToothNumber,

                            // Mapping CDT codes associated with each procedure
                            ProcedureToCdtMaps = vp.ProcedureToCdtMaps.Select(ptc => new ProcedureToCdtMapDto
                            {
                                CdtCodeId = ptc.CdtCode.CdtCodeId,
                                Code = ptc.CdtCode.Code,
                                LongDescription = ptc.CdtCode.LongDescription,
                                Default = ptc.Default
                            }).ToList()
                        }).ToList()
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            // Returning the detailed treatment plan data
            return treatmentPlan;
        }


        public async Task<IEnumerable<RetrieveTreatmentPlanDto>> GetTreatmentPlansAsync()
        {
            // Retrieving all treatment plans and projecting them to TreatmentPlanDto
            var treatmentPlans = await _context.TreatmentPlans
                .Select(tp => new RetrieveTreatmentPlanDto
                {
                    TreatmentPlanId = tp.TreatmentPlanId,
                    Description = tp.Description,
                    ProcedureSubcategoryId = tp.ProcedureSubcategoryId,

                    // Mapping the visits and associated procedures for each treatment plan
                    Visits = tp.Visits.Select(v => new RetrieveVisitDto
                    {
                        VisitId = v.VisitId,
                        Description = v.Description,
                        VisitNumber = v.VisitNumber,

                        Procedures = v.VisitToProcedureMaps.Select(vp => new VisitToProcedureMapDto
                        {
                            ProcedureTypeId = vp.ProcedureTypeId,
                            Order = vp.Order,
                            ToothNumber = vp.ToothNumber,

                            // Mapping CDT codes associated with each procedure
                            ProcedureToCdtMaps = vp.ProcedureToCdtMaps.Select(ptc => new ProcedureToCdtMapDto
                            {
                                CdtCodeId = ptc.CdtCode.CdtCodeId,
                                Code = ptc.CdtCode.Code,
                                LongDescription = ptc.CdtCode.LongDescription,
                                Default = ptc.Default
                            }).ToList()
                        }).ToList()
                    }).ToList()
                })
                .ToListAsync();

            // Returning the list of treatment plans
            return treatmentPlans;
        }


        public async Task<TreatmentPlan> CreateTreatmentPlanAsync(CreateTreatmentPlanDto treatmentPlanDto)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Finding the corresponding procedure subcategory
                    var procedureSubCategory = await _context.ProcedureSubCategories
                        .FirstOrDefaultAsync(pc => pc.Name == treatmentPlanDto.Description);

                    // Creating a new treatment plan
                    var treatmentPlan = new TreatmentPlan
                    {
                        Description = treatmentPlanDto.Description,
                        ProcedureSubcategoryId = procedureSubCategory?.ProcedureSubCategoryId,
                        CreatedUserId = treatmentPlanDto.CreatedUserId
                    };

                    _context.TreatmentPlans.Add(treatmentPlan);
                    await _context.SaveChangesAsync();

                    // Process each user-defined visit from the DTO
                    foreach (var visitDto in treatmentPlanDto.Visits)
                    {
                        var visit = new Visit
                        {
                            TreatmentPlanId = treatmentPlan.TreatmentPlanId,
                            Description = visitDto.Description
                        };

                        _context.Visits.Add(visit);
                        await _context.SaveChangesAsync();

                        // For each procedure in the visit
                        foreach (var procedureDto in visitDto.Procedures)
                        {
                            var visitToProcedureMap = new VisitToProcedureMap
                            {
                                VisitId = visit.VisitId,
                                ProcedureTypeId = procedureDto.ProcedureTypeId,
                                Order = procedureDto.Order,
                                ToothNumber = procedureDto.ToothNumber
                            };

                            _context.VisitToProcedureMaps.Add(visitToProcedureMap);
                            await _context.SaveChangesAsync();

                            // For each CDT code in the procedure
                            foreach (var cdtCodeDto in procedureDto.ProcedureToCdtMaps)
                            {
                                var procedureToCdtMap = new ProcedureToCdtMap
                                {
                                    VisitToProcedureMapId = visitToProcedureMap.VisitToProcedureMapId,
                                    CdtCodeId = cdtCodeDto.CdtCodeId,
                                    Default = cdtCodeDto.Default
                                };

                                _context.ProcedureToCdtMaps.Add(procedureToCdtMap);
                            }
                        }
                    }

                    await _context.SaveChangesAsync();

                    // Loading the visit and procedure details into the treatment plan
                    _context.Entry(treatmentPlan).Collection(tp => tp.Visits).Load();
                    foreach (var visit in treatmentPlan.Visits)
                    {
                        _context.Entry(visit).Collection(v => v.VisitToProcedureMaps).Load();
                        foreach (var procedure in visit.VisitToProcedureMaps)
                        {
                            _context.Entry(procedure).Collection(p => p.ProcedureToCdtMaps).Load();
                        }
                    }

                    await transaction.CommitAsync();
                    return treatmentPlan;
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    Console.WriteLine($"Error occurred during transaction: {ex.Message}");
                    throw;
                }
            }
        }


        public async Task UpdateProceduresAsync(List<UpdateProcedureDto> updatedProcedures)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    foreach (var updateProc in updatedProcedures)
                    {
                        // For each procedure, update or add new ProcedureToCdtMap entries as necessary
                        foreach (var procDto in updateProc.Procedures ?? new List<ProcedureToCdtMapDto>())
                        {
                            var procedureCdtMap = await _context.ProcedureToCdtMaps
                                .FirstOrDefaultAsync(p => p.ProcedureToCdtMapId == procDto.ProcedureToCdtMapId && p.VisitToProcedureMapId == updateProc.VisitToProcedureMapId);

                            if (procedureCdtMap != null)
                            {
                                // If found, update the existing ProcedureToCdtMap entry
                                procedureCdtMap.CdtCodeId = procDto.CdtCodeId;
                                procedureCdtMap.Default = procDto.Default;
                                procedureCdtMap.UserDescription = procDto.UserDescription;

                                _logger.LogInformation($"Updating ProcedureToCdtMap with ID: {procDto.ProcedureToCdtMapId}");
                            }
                            else
                            {
                                // If not found, add a new ProcedureToCdtMap entry
                                _context.ProcedureToCdtMaps.Add(new ProcedureToCdtMap
                                {
                                    VisitToProcedureMapId = updateProc.VisitToProcedureMapId,
                                    CdtCodeId = procDto.CdtCodeId,
                                    Default = procDto.Default,
                                    UserDescription = procDto.UserDescription
                                });

                                _logger.LogInformation($"Adding new ProcedureToCdtMap for VisitToProcedureMap ID: {updateProc.VisitToProcedureMapId}");
                            }
                        }
                    }

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    _logger.LogError($"Error occurred during procedures update: {ex.Message}");
                    throw;
                }
            }
        }



        public async Task<List<VisitToProcedureMapDto>> CreateNewProceduresAsync(List<NewProcedureDto> newProcedures)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var newProcedureMaps = new List<VisitToProcedureMap>();

                    foreach (var newProc in newProcedures)
                    {
                        Console.Write($"Creating new VisitToProcedureMap with VisitId: {newProc.VisitId}, Order: {newProc.Order}");
                        var newProcedureMap = new VisitToProcedureMap
                        {
                            VisitId = newProc.VisitId.Value,
                            Order = newProc.Order,
                        };

                        // If your NewProcedureDto includes details to create ProcedureToCdtMap entries, do it here

                        newProcedureMaps.Add(newProcedureMap);
                    }

                    _context.VisitToProcedureMaps.AddRange(newProcedureMaps);
                    await _context.SaveChangesAsync();

                    var newProcedureMapDtos = newProcedureMaps.Select(p => new VisitToProcedureMapDto
                    {
                        VisitToProcedureMapId = p.VisitToProcedureMapId,
                        VisitId = p.VisitId,
                        Order = p.Order,
                        // Map other relevant fields
                    }).ToList();

                    await transaction.CommitAsync();
                    return newProcedureMapDtos;
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    Console.WriteLine($"Error occurred during new procedures creation: {ex.Message}");
                    throw;
                }
            }
        }




        public async Task<TreatmentPlan> UpdateTreatmentPlanAsync(UpdateTreatmentPlanDto updateTreatmentPlanDto)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var treatmentPlan = await _context.TreatmentPlans
                        .Include(tp => tp.Visits)
                            .ThenInclude(v => v.VisitToProcedureMaps)
                                .ThenInclude(vpm => vpm.ProcedureToCdtMaps)
                        .Include(tp => tp.ProcedureSubcategory)
                            .ThenInclude(sc => sc.ProcedureCategory) // Ensure the ProcedureCategory is eagerly loaded
                        .FirstOrDefaultAsync(tp => tp.TreatmentPlanId == updateTreatmentPlanDto.TreatmentPlanId);


                    if (treatmentPlan == null)
                    {
                        throw new KeyNotFoundException("Treatment plan not found.");
                    }

                    treatmentPlan.ProcedureSubcategoryId = updateTreatmentPlanDto.ProcedureSubcategoryId;

                    foreach (var visitDto in updateTreatmentPlanDto.Visits)
                    {
                        string visitDtoJson = System.Text.Json.JsonSerializer.Serialize(visitDto, new System.Text.Json.JsonSerializerOptions { WriteIndented = true });
                        Console.WriteLine($"Updating procedures for VisitDto: {visitDtoJson}");

                        var visit = treatmentPlan.Visits.FirstOrDefault(v => v.VisitId == visitDto.VisitId);
                        if (visit != null)
                        {
                            visit.VisitNumber = visitDto.VisitNumber;
                            UpdateVisitProcedures(visit, visitDto.VisitToProcedureMapDtos);
                        }
                    }

                    foreach (var deletedVisitId in updateTreatmentPlanDto.DeletedVisitIds)
                    {
                        var visitToDelete = treatmentPlan.Visits.FirstOrDefault(v => v.VisitId == deletedVisitId);
                        if (visitToDelete != null)
                        {
                            _context.Visits.Remove(visitToDelete);
                        }
                    }

                    // Aggregate all ProcedureToCdtMapDto objects for the CreateUpdateDeleteProcedureToCdtMaps method
                    var allProcedureToCdtMapInfo = updateTreatmentPlanDto.Visits
                        .SelectMany(visit => visit.VisitToProcedureMapDtos
                            .SelectMany(vtpm => vtpm.ProcedureToCdtMaps
                                .Select(ptcm => (ProcedureToCdtMapDto: ptcm, VisitToProcedureMapId: vtpm.VisitToProcedureMapId))))
                        .ToList();

                    await CreateUpdateDeleteProcedureToCdtMaps(allProcedureToCdtMapInfo, updateTreatmentPlanDto.TreatmentPlanId);


                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                    return treatmentPlan;
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    Console.WriteLine($"Error occurred during update transaction: {ex.Message}");
                    throw;
                }
            }
        }



        public async Task CreateUpdateDeleteProcedureToCdtMaps(List<(ProcedureToCdtMapDto ProcedureToCdtMapDto, int VisitToProcedureMapId)> procedureToCdtMapsInfo, int treatmentPlanId)
        {
            // First, filter out only the alternative (non-default) procedures from the provided tuples
            var nonDefaultProcedureToCdtMapsInfo = procedureToCdtMapsInfo.Where(info => !info.ProcedureToCdtMapDto.Default).ToList();

            // Load all non-default ProcedureToCdtMaps associated with the specified treatment plan
            var existingProcedureToCdtMaps = await _context.ProcedureToCdtMaps
                .Where(ptcm => !ptcm.Default && _context.VisitToProcedureMaps
                    .Any(vtpm => vtpm.VisitToProcedureMapId == ptcm.VisitToProcedureMapId &&
                                 _context.Visits
                                     .Any(v => v.VisitId == vtpm.VisitId &&
                                               _context.TreatmentPlans
                                                   .Any(tp => tp.TreatmentPlanId == v.TreatmentPlanId &&
                                                              tp.TreatmentPlanId == treatmentPlanId))))
                .ToListAsync();

            // Extract IDs of provided non-default ProcedureToCdtMaps for comparison
            var providedIds = nonDefaultProcedureToCdtMapsInfo
                .Select(info => info.ProcedureToCdtMapDto.ProcedureToCdtMapId)
                .ToList();

            // Iterate over each provided DTO to update existing maps or create new ones
            foreach (var (dto, visitToProcedureMapId) in nonDefaultProcedureToCdtMapsInfo)
            {
                if (dto.ProcedureToCdtMapId > 0) // DTO has an ID, indicating an existing map
                {
                    // Find the existing map to update
                    var existingMap = existingProcedureToCdtMaps.FirstOrDefault(ptcm => ptcm.ProcedureToCdtMapId == dto.ProcedureToCdtMapId);
                    if (existingMap != null) // Check if the existing map was found
                    {
                        // Update properties of the existing map
                        existingMap.CdtCodeId = dto.CdtCodeId;
                        existingMap.UserDescription = dto.UserDescription;
                        // No need to update the 'Default' flag here since we're only dealing with non-default entries
                    }
                }
                else // DTO does not have an ID, indicating a new map to create
                {
                    // Create a new map with details from the DTO
                    var newMap = new ProcedureToCdtMap
                    {
                        VisitToProcedureMapId = visitToProcedureMapId,
                        CdtCodeId = dto.CdtCodeId,
                        Default = false, // Since we're only dealing with alternative procedures
                        UserDescription = dto.UserDescription,
                    };
                    _context.ProcedureToCdtMaps.Add(newMap); // Add the new map to the context
                }
            }

            // Identify non-default maps to delete: those not present in the provided DTOs but existing in the database
            var mapsToDelete = existingProcedureToCdtMaps.Where(ptcm => !providedIds.Contains(ptcm.ProcedureToCdtMapId)).ToList();
            _context.ProcedureToCdtMaps.RemoveRange(mapsToDelete); // Remove these maps from the context

            await _context.SaveChangesAsync(); // Save all changes to the database
        }


        public async Task<TreatmentPlan> CreateNewTreatmentPlanFromDefaultAsync(CreateNewTxPlanFromDefaultDto createNewTxPlanFromDefaultDto, int facilityId)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Create a new treatment plan based on the default
                    TreatmentPlan newTreatmentPlan = new TreatmentPlan
                    {
                        //Description = createNewTxPlanFromDefaultDto.Description,
                        ProcedureSubcategoryId = createNewTxPlanFromDefaultDto.ProcedureSubcategoryId,
                        FacilityId = facilityId,
                    };

                    foreach (var visitDto in createNewTxPlanFromDefaultDto.Visits)
                    {
                        Visit newVisit = new Visit
                        {
                            Description = visitDto.Description,
                            //VisitNumber = visitDto.VisitNumber,
                            TreatmentPlan = newTreatmentPlan
                        };

                        foreach (var procedureDto in visitDto.VisitToProcedureMaps)
                        {
                            VisitToProcedureMap newVisitToProcedure = new VisitToProcedureMap
                            {
                                Order = procedureDto.Order,
                                ToothNumber = procedureDto.ToothNumber,
                                Surface = procedureDto.Surface,
                                Arch = procedureDto.Arch,
                                Visit = newVisit // Linking back to the Visit
                            };

                            foreach (var procedureToCdtDto in procedureDto.ProcedureToCdtMaps)
                            {
                                ProcedureToCdtMap newProcedureToCdt = new ProcedureToCdtMap
                                {
                                    UserDescription = procedureToCdtDto.UserDescription,
                                    CdtCodeId = procedureToCdtDto.CdtCodeId,
                                    Default = procedureToCdtDto.Default,
                                    VisitToProcedureMap = newVisitToProcedure
                                };

                                newVisitToProcedure.ProcedureToCdtMaps.Add(newProcedureToCdt);
                            }

                            newVisit.VisitToProcedureMaps.Add(newVisitToProcedure);
                        }

                        newTreatmentPlan.Visits.Add(newVisit);
                    }

                    // Save the new treatment plan to the database
                    await _context.TreatmentPlans.AddAsync(newTreatmentPlan);
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                    return newTreatmentPlan;
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    Console.WriteLine($"Error occurred: {ex.Message}");
                    throw;
                }
            }
        }


        public async Task<bool> DeleteTreatmentPlanByIdAsync(int treatmentPlanId)
        {
            _logger.LogInformation($"Attempting to delete treatment plan with ID: {treatmentPlanId}");
            // Open a connection to the database
            var connection = _context.Database.GetDbConnection();
            try
            {

                await connection.OpenAsync();

                using (var command = connection.CreateCommand())
                {
                    command.CommandText = "SELECT [treatment_plan_id], [created_at], [created_user_id], [description], [FacilityId], [modified_at], [PatientId], [PayerId], [procedure_subcategory_id] FROM [treatment_plan] WHERE [treatment_plan_id] = @treatmentPlanId";
                    var parameter = command.CreateParameter();
                    parameter.ParameterName = "@treatmentPlanId";
                    parameter.Value = treatmentPlanId;
                    command.Parameters.Add(parameter);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            // Manually inspect each column in 'reader'
                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                var columnName = reader.GetName(i);
                                var columnValue = reader.IsDBNull(i) ? "NULL" : reader.GetValue(i).ToString();
                                _logger.LogInformation($"Column name: {columnName}, Column value: {columnValue}");
                            }
                        }
                        else
                        {
                            _logger.LogWarning($"No treatment plan found with ID: {treatmentPlanId}");
                            return false;
                        }
                    }
                }

                // Assuming the treatment plan exists and you've inspected the values, proceed with deletion
                var treatmentPlan = await _context.TreatmentPlans.FindAsync(treatmentPlanId);
                _context.TreatmentPlans.Remove(treatmentPlan);
                await _context.SaveChangesAsync();
                _logger.LogInformation($"Treatment plan with ID: {treatmentPlanId} has been successfully deleted.");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"An error occurred while attempting to delete treatment plan with ID: {treatmentPlanId}.");
                return false;
            }
            finally
            {
                // Ensure the database connection is closed
                if (connection.State == System.Data.ConnectionState.Open)
                {
                    await connection.CloseAsync();
                }
            }
        }




        //with edits
        public async Task<TreatmentPlan> CreateNewTreatmentPlanForPatientFromCombinedAsync(CreateUnmodifiedPatientTxDto createUnmodifiedPatientTxDto, int facilityId)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Create a new treatment plan
                    TreatmentPlan newTreatmentPlan = new TreatmentPlan
                    {
                        Description = createUnmodifiedPatientTxDto.Description,
                        ProcedureSubcategoryId = createUnmodifiedPatientTxDto.ProcedureSubcategoryId,
                        FacilityId = facilityId,
                        PatientId = createUnmodifiedPatientTxDto.PatientId,
                        PayerId = createUnmodifiedPatientTxDto.PayerId
                    };

                    foreach (var visitDto in createUnmodifiedPatientTxDto.Visits)
                    {
                        Visit newVisit = new Visit
                        {
                            Description = visitDto.Description,
                            VisitNumber = visitDto.VisitNumber,
                        };

                        foreach (var procedureMapDto in visitDto.VisitToProcedureMaps)
                        {
                            VisitToProcedureMap newProcedureMap = new VisitToProcedureMap
                            {
                                Order = procedureMapDto.Order,
                                ToothNumber = procedureMapDto.ToothNumber,
                                Surface = procedureMapDto.Surface,
                                Arch = procedureMapDto.Arch,
                                ProcedureTypeId = procedureMapDto.ProcedureTypeId,
                            };

                            
                            foreach (var cdtMapDto in procedureMapDto.ProcedureToCdtMaps)
                            {
                                ProcedureToCdtMap newCdtMap = new ProcedureToCdtMap
                                {
                                    CdtCodeId = cdtMapDto.CdtCodeId,
                                    UserDescription = cdtMapDto.UserDescription,
                                    Default = cdtMapDto.Default,
                                };
                                newProcedureMap.ProcedureToCdtMaps.Add(newCdtMap);
                            }

                            newVisit.VisitToProcedureMaps.Add(newProcedureMap);
                        }

                        newTreatmentPlan.Visits.Add(newVisit);
                    }

                    // Save the new treatment plan to the database
                    await _context.TreatmentPlans.AddAsync(newTreatmentPlan);
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                    return newTreatmentPlan;
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    Console.WriteLine($"Error occurred: {ex.Message}");
                    throw;
                }
            }
        }

        public async Task<RetrievePatientTreatmentPlanDto> CreateNewTreatmentPlanForPatientFromCombinedAsyncPriorHippa(CreateUnmodifiedPatientTxDto createUnmodifiedPatientTxDto, int facilityId)
        {
            // Start a new database transaction
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Create and save a new TreatmentPlan entity
                    TreatmentPlan newTreatmentPlan = new TreatmentPlan
                    {
                        Description = createUnmodifiedPatientTxDto.Description,
                        ProcedureSubcategoryId = createUnmodifiedPatientTxDto.ProcedureSubcategoryId,
                        FacilityId = facilityId,
                        PatientId = createUnmodifiedPatientTxDto.PatientId,
                        PayerId = createUnmodifiedPatientTxDto.PayerId,
                    };

                    _context.TreatmentPlans.Add(newTreatmentPlan);
                    await _context.SaveChangesAsync();

                    // Initialize mappings to track VisitToProcedureMap IDs and entities
                    Dictionary<int, int> visitToProcedureMapIdMapping = new Dictionary<int, int>();
                    Dictionary<int, VisitToProcedureMap> newProcedureMaps = new Dictionary<int, VisitToProcedureMap>();

                    // Iterate over all visits in the DTO
                    foreach (var visitDto in createUnmodifiedPatientTxDto.Visits)
                    {
                        // Create and save a new Visit entity
                        Visit newVisit = new Visit
                        {
                            TreatmentPlanId = newTreatmentPlan.TreatmentPlanId,
                            Description = visitDto.Description,
                            VisitNumber = visitDto.VisitNumber,
                        };

                        _context.Visits.Add(newVisit);
                        await _context.SaveChangesAsync();

                        // Iterate over all procedure maps within the visit
                        foreach (var procedureMapDto in visitDto.VisitToProcedureMaps)
                        {
                            VisitToProcedureMap newProcedureMap;

                            // Check if this procedure map ID has already been processed
                            if (!visitToProcedureMapIdMapping.TryGetValue(procedureMapDto.VisitToProcedureMapId, out int newVisitToProcedureMapId))
                            {
                                // Create a new VisitToProcedureMap entity for new procedure maps
                                newProcedureMap = new VisitToProcedureMap
                                {
                                    VisitId = newVisit.VisitId,
                                    Order = procedureMapDto.Order,
                                    ToothNumber = procedureMapDto.ToothNumber,
                                    Surface = procedureMapDto.Surface,
                                    Arch = procedureMapDto.Arch,
                                    ProcedureTypeId = procedureMapDto.ProcedureTypeId,
                                };

                                _context.VisitToProcedureMaps.Add(newProcedureMap);
                                await _context.SaveChangesAsync(); // Save to generate a new ID

                                // Update mappings with the new VisitToProcedureMap ID
                                newVisitToProcedureMapId = newProcedureMap.VisitToProcedureMapId;
                                visitToProcedureMapIdMapping[procedureMapDto.VisitToProcedureMapId] = newVisitToProcedureMapId;
                                newProcedureMaps[newVisitToProcedureMapId] = newProcedureMap;

                                Console.WriteLine($"New VisitToProcedureMap created for VisitToProcedureMapId {procedureMapDto.VisitToProcedureMapId}, new ID: {newVisitToProcedureMapId}");
                            }
                            else
                            {
                                // Use the existing VisitToProcedureMap entity for procedure maps that have already been processed
                                newProcedureMap = newProcedureMaps[newVisitToProcedureMapId];
                                Console.WriteLine($"Using existing VisitToProcedureMap with new ID: {newVisitToProcedureMapId} for old VisitToProcedureMapId {procedureMapDto.VisitToProcedureMapId}");
                            }

                            // Add ProcedureToCdtMap entities to the VisitToProcedureMap
                            foreach (var cdtMapDto in procedureMapDto.ProcedureToCdtMaps)
                            {
                                newProcedureMap.ProcedureToCdtMaps.Add(new ProcedureToCdtMap
                                {
                                    UserDescription = cdtMapDto.UserDescription,
                                    CdtCodeId = cdtMapDto.CdtCodeId,
                                    Default = cdtMapDto.Default,
                                });
                                Console.WriteLine($"Attempting to add ProcedureToCdtMap with CdtCodeId: {cdtMapDto.CdtCodeId}, Default: {cdtMapDto.Default} to VisitToProcedureMapId {newVisitToProcedureMapId}");
                            }
                            Console.WriteLine($"Total ProcedureToCdtMaps now in VisitToProcedureMap {newVisitToProcedureMapId}: {newProcedureMap.ProcedureToCdtMaps.Count}");
                        }
                    }

                    foreach (var entry in newProcedureMaps.Values)
                    {
                        Console.WriteLine($"Before Save: VisitToProcedureMapId {entry.VisitToProcedureMapId} has {entry.ProcedureToCdtMaps.Count} ProcedureToCdtMaps");
                    }

                    // Final save to ensure all changes are persisted
                    await _context.SaveChangesAsync();
                    Console.WriteLine("Final SaveChangesAsync called for all changes.");

                    // Commit the transaction after successful operation
                    await transaction.CommitAsync();

                    // After committing the transaction, re-query the treatment plan with related entities
                    var retrievedTreatmentPlan = await _context.TreatmentPlans
                        .Where(tp => tp.TreatmentPlanId == newTreatmentPlan.TreatmentPlanId)
                        .Include(tp => tp.Visits)
                            .ThenInclude(v => v.VisitToProcedureMaps)
                                .ThenInclude(vtpm => vtpm.ProcedureToCdtMaps)
                                    .ThenInclude(ptcm => ptcm.CdtCode)
                        .Select(tp => new RetrievePatientTreatmentPlanDto
                        {
                            TreatmentPlanId = tp.TreatmentPlanId,
                            Description = tp.Description,
                            CreatedAt = tp.CreatedAt,
                            Visits = tp.Visits.Select(v => new RetrieveVisitDto
                            {
                                VisitId = v.VisitId,
                                Description = v.Description,
                                VisitNumber = v.VisitNumber,
                                Procedures = MapVisitToProcedureMapsToDto(v.VisitToProcedureMaps) // Use the existing method
                            }).ToList()
                        })
                        .FirstOrDefaultAsync();

                    return retrievedTreatmentPlan;
                }

                catch (Exception ex)
                {
                    // Rollback the transaction in case of an exception
                    await transaction.RollbackAsync();
                    Console.WriteLine($"Error occurred: {ex.Message}");
                    throw;
                }
            }
        }








        private void UpdateVisitProcedures(Visit visit, ICollection<VisitToProcedureMapDto> updatedProcedureMaps)
        {
            Console.WriteLine($"Starting update for Visit ID: {visit.VisitId}. Number of procedure maps before update: {visit.VisitToProcedureMaps.Count}");

            foreach (var procedureMapDto in updatedProcedureMaps)
            {
                var procedureMap = visit.VisitToProcedureMaps.FirstOrDefault(v => v.VisitToProcedureMapId == procedureMapDto.VisitToProcedureMapId);
                if (procedureMap != null)
                {
                    Console.WriteLine($"Updating existing ProcedureMapId: {procedureMapDto.VisitToProcedureMapId}");

                    // Update properties of VisitToProcedureMap
                    procedureMap.Order = procedureMapDto.Order;
                    procedureMap.ToothNumber = procedureMapDto.ToothNumber;
                    procedureMap.ProcedureTypeId = procedureMapDto.ProcedureTypeId;
                    procedureMap.Surface = procedureMapDto.Surface;
                    procedureMap.Arch = procedureMapDto.Arch;

                    // Iterate only over default ProcedureToCdtMaps within this VisitToProcedureMap
                    foreach (var cdtMapDto in procedureMapDto.ProcedureToCdtMaps.Where(c => c.Default))
                    {
                        var cdtMap = procedureMap.ProcedureToCdtMaps.FirstOrDefault(c => c.ProcedureToCdtMapId == cdtMapDto.ProcedureToCdtMapId);

                        if (cdtMap != null && cdtMap.CdtCodeId != cdtMapDto.CdtCodeId)
                        {
                            Console.WriteLine($"Updating existing CdtMapId: {cdtMapDto.ProcedureToCdtMapId} with new CdtCodeId: {cdtMapDto.CdtCodeId}");

                            // Update properties if CdtCodeId has changed
                            cdtMap.CdtCodeId = cdtMapDto.CdtCodeId;
                        }
                        else if (cdtMap == null)
                        {
                            Console.WriteLine($"Adding new CDT map for ProcedureMapId: {procedureMapDto.VisitToProcedureMapId}");

                            // Create a new default CDT map
                            procedureMap.ProcedureToCdtMaps.Add(new ProcedureToCdtMap
                            {
                                UserDescription = cdtMapDto.UserDescription,
                                CdtCodeId = cdtMapDto.CdtCodeId,
                                Default = true,
                                VisitToProcedureMapId = procedureMap.VisitToProcedureMapId
                            });
                        }
                    }
                }
                else
                {
                    Console.WriteLine($"Creating new ProcedureMap for VisitId: {visit.VisitId}");

                    // Handle creating a new procedure map with default ProcedureToCdtMaps
                    var newProcedureMap = new VisitToProcedureMap
                    {
                        VisitId = visit.VisitId,
                        Order = procedureMapDto.Order,
                        ToothNumber = procedureMapDto.ToothNumber,
                        ProcedureTypeId = procedureMapDto.ProcedureTypeId,
                        Surface = procedureMapDto.Surface,
                        Arch = procedureMapDto.Arch,
                        ProcedureToCdtMaps = procedureMapDto.ProcedureToCdtMaps
                            .Where(c => c.Default)
                            .Select(cdtDto => new ProcedureToCdtMap
                            {
                                UserDescription = cdtDto.UserDescription,
                                CdtCodeId = cdtDto.CdtCodeId,
                                Default = true
                            }).ToList()
                    };
                    visit.VisitToProcedureMaps.Add(newProcedureMap);
                }
            }

            // Remove VisitToProcedureMaps that are no longer in the updated list
            var procedureMapsToRemove = visit.VisitToProcedureMaps
                .Where(v => !updatedProcedureMaps.Any(up => up.VisitToProcedureMapId == v.VisitToProcedureMapId))
                .ToList();
            Console.WriteLine($"Found {procedureMapsToRemove.Count} procedure maps to remove.");

            foreach (var procedureMap in procedureMapsToRemove)
            {
                Console.WriteLine($"Removing ProcedureMapId: {procedureMap.VisitToProcedureMapId}");

                visit.VisitToProcedureMaps.Remove(procedureMap);
            }
            Console.WriteLine($"Update complete. Number of procedure maps after update: {visit.VisitToProcedureMaps.Count}");

        }






        public async Task<VisitCreationResult> CreateVisitAsync(CreateVisitDto createVisitDto)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Verify if the treatment plan exists
                    var treatmentPlan = await _context.TreatmentPlans
                        .FirstOrDefaultAsync(tp => tp.TreatmentPlanId == createVisitDto.TreatmentPlanId);

                    if (treatmentPlan == null)
                    {
                        throw new KeyNotFoundException("Treatment plan not found.");
                    }

                    // Creating a new visit entity
                    var visit = new Visit
                    {
                        TreatmentPlanId = createVisitDto.TreatmentPlanId,
                        Description = createVisitDto.Description,
                        VisitNumber = createVisitDto.VisitNumber
                    };

                    _context.Visits.Add(visit);
                    await _context.SaveChangesAsync();
                    Console.WriteLine($"Created visit: {visit}");

                    // Commit the transaction
                    await transaction.CommitAsync();

                    // Return an instance of VisitCreationResult
                    return new VisitCreationResult
                    {
                        Visit = visit,
                        TempVisitId = createVisitDto.TempVisitId
                    };
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    Console.WriteLine($"Error occurred during transaction: {ex.Message}");
                    throw;
                }
            }
        }

        private async Task<int> GetOrderForVisit(int toothNumber, int visitNumber)
        {
            var orderRule = await _context.VisitOrderRules
                .FirstOrDefaultAsync(rule => toothNumber >= rule.ToothNumberRangeStart
                                              && toothNumber <= rule.ToothNumberRangeEnd
                                              && visitNumber == rule.VisitNumber);

            return orderRule != null ? orderRule.OrderValue : 0; // Return the found order, or 0 if no rule matches
        }

        public async Task<IEnumerable<ProcedureCategoryDto>> GetAllCategoriesAsync()
        {
            return await _context.ProcedureCategories
                        .Select(c => new ProcedureCategoryDto
                        {
                            ProcedureCategoryId = c.ProcedureCategoryId,
                            Name = c.Name
                        })
                        .ToListAsync();
        }


        public async Task<IEnumerable<ProcedureSubCategoryDto>> GetSubCategoriesByCategoryNameAsync(string categoryName)
        {
            return await _context.ProcedureCategories
                .Where(pc => pc.Name == categoryName)
                .SelectMany(pc => pc.ProcedureSubCategories)
                .Select(sc => new ProcedureSubCategoryDto
                {
                    ProcedureSubCategoryId = sc.ProcedureSubCategoryId,
                    Name = sc.Name
                })
                .ToListAsync();
        }

        // Method to retrieve treatment plans by procedure subcategory name
        public async Task<IEnumerable<RetrieveTreatmentPlanDto>> GetTreatmentPlansBySubcategoryAsync(string subcategoryName, int? facilityId)
        {
            var subcategory = await _context.ProcedureSubCategories
                                            .FirstOrDefaultAsync(sc => sc.Name == subcategoryName);

            if (subcategory == null)
            {
                return Enumerable.Empty<RetrieveTreatmentPlanDto>();
            }

            int subcategoryId = subcategory.ProcedureSubCategoryId;

            // Initialize the base query with necessary includes for eager loading
            var baseQuery = _context.TreatmentPlans
                .Include(tp => tp.Visits)
                    .ThenInclude(v => v.VisitToProcedureMaps)
                        .ThenInclude(vp => vp.ProcedureType)
                .Include(tp => tp.Visits)
                    .ThenInclude(v => v.VisitToProcedureMaps)
                        .ThenInclude(vp => vp.ProcedureToCdtMaps)
                            .ThenInclude(pcm => pcm.CdtCode)
                .Where(tp => tp.ProcedureSubcategoryId == subcategoryId && tp.PatientId == null);

            // Check for facility-specific treatment plans first if a facilityId is provided
            IQueryable<TreatmentPlan> facilitySpecificQuery = baseQuery
                .Where(tp => facilityId.HasValue && tp.FacilityId == facilityId);

            // Check if any facility-specific plans are found
            bool hasFacilitySpecificPlans = await facilitySpecificQuery.AnyAsync();

            IQueryable<TreatmentPlan> query = hasFacilitySpecificPlans ? facilitySpecificQuery : baseQuery
                .Where(tp => !facilityId.HasValue || tp.FacilityId == null);

            var treatmentPlans = await query
                .Select(tp => new RetrieveTreatmentPlanDto
                {
                    TreatmentPlanId = tp.TreatmentPlanId,
                    ProcedureSubcategoryId = tp.ProcedureSubcategoryId,
                    ProcedureSubCategoryName = tp.ProcedureSubcategory.Name,
                    FacilityId = tp.FacilityId,
                    CreatedUserId = tp.CreatedUserId,
                    ProcedureCategoryName = tp.ProcedureSubcategory.ProcedureCategory.Name,
                    Visits = tp.Visits.Select(v => new RetrieveVisitDto
                    {
                        VisitId = v.VisitId,
                        Description = v.Description,
                        VisitNumber = v.VisitNumber,
                        Procedures = MapVisitToProcedureMapsToDto(v.VisitToProcedureMaps)
                    }).ToList()
                })
                .ToListAsync();

            return treatmentPlans;
        }


        private static List<VisitToProcedureMapDto> MapVisitToProcedureMapsToDto(IEnumerable<VisitToProcedureMap> visitToProcedureMaps)
        {
            return visitToProcedureMaps.Select(vpm =>
            {
                // Mapping for ProcedureToCdtMaps within a VisitToProcedureMap
                var procedureToCdtMapDtos = vpm.ProcedureToCdtMaps.Select(pcm => new ProcedureToCdtMapDto
                {
                    ProcedureToCdtMapId = pcm.ProcedureToCdtMapId,
                    CdtCodeId = pcm.CdtCodeId,
                    UserDescription = pcm.UserDescription,
                    Default = pcm.Default,
                    Code = pcm.CdtCode?.Code ?? string.Empty,
                    LongDescription = pcm.CdtCode.LongDescription
                }).ToList();

                return new VisitToProcedureMapDto
                {
                    VisitToProcedureMapId = vpm.VisitToProcedureMapId,
                    Order = vpm.Order,
                    ToothNumber = vpm.ToothNumber,
                    Surface = vpm.Surface,
                    Arch = vpm.Arch,
                    ProcedureTypeId = vpm.ProcedureTypeId,
                    ProcedureToCdtMaps = procedureToCdtMapDtos,
                };
            }).ToList();
        }


        public async Task<IEnumerable<RetrievePatientTreatmentPlanDto>> GetAllPatientTreatmentPlansForFacilityAsync(int facilityId)
        {
            IQueryable<TreatmentPlan> query = _context.TreatmentPlans
                .Where(tp => tp.FacilityId == facilityId && tp.PatientId != null)
                .Include(tp => tp.Patient)
                .Include(tp => tp.Visits)
                    .ThenInclude(v => v.VisitToProcedureMaps)
                        .ThenInclude(vtp => vtp.ProcedureToCdtMaps)
                            .ThenInclude(ptc => ptc.CdtCode);

            var treatmentPlans = await query
                .OrderBy(tp => tp.CreatedAt)
                .Select(tp => new RetrievePatientTreatmentPlanDto
                {
                    TreatmentPlanId = tp.TreatmentPlanId,
                    ProcedureSubcategoryId = tp.ProcedureSubcategoryId,
                    CreatedUserId = tp.CreatedUserId,
                    CreatedAt = tp.CreatedAt,
                    PayerId = tp.PayerId,
                    PatientName = (tp.Patient.FirstName ?? "") + " " + (tp.Patient.LastName ?? ""),

                    Visits = tp.Visits.Select(v => new RetrieveVisitDto
                    {
                        VisitId = v.VisitId,
                        Description = v.Description,
                        VisitNumber = v.VisitNumber,

                        Procedures = v.VisitToProcedureMaps.Select(vtp => new VisitToProcedureMapDto
                        {
                            Order = vtp.Order,
                            ProcedureTypeId = vtp.ProcedureTypeId,
                            ToothNumber = vtp.ToothNumber,
                            Surface = vtp.Surface,
                            Arch = vtp.Arch,
                            ProcedureToCdtMaps = vtp.ProcedureToCdtMaps.Select(ptc => new ProcedureToCdtMapDto
                            {
                                ProcedureToCdtMapId = ptc.ProcedureToCdtMapId,
                                CdtCodeId = ptc.CdtCode.CdtCodeId,
                                UserDescription = ptc.UserDescription,
                                Default = ptc.Default,
                                Code = ptc.CdtCode.Code,
                                LongDescription = ptc.CdtCode.LongDescription
                            }).ToList()
                        }).ToList()
                    }).ToList()
                })
                .ToListAsync();

            return treatmentPlans;
        }



        public async Task<IEnumerable<RetrievePatientTreatmentPlanDto>> GetAllPatientTreatmentPlansForFacilityAsyncPriorHippa(int facilityId)
        {
            IQueryable<TreatmentPlan> query = _context.TreatmentPlans
                .Where(tp => tp.FacilityId == facilityId && (tp.PatientId != null || tp.ProcedureSubcategoryId == null))
                .Include(tp => tp.Patient)
                .Include(tp => tp.Visits)
                    .ThenInclude(v => v.VisitToProcedureMaps)
                        .ThenInclude(vtp => vtp.ProcedureToCdtMaps)
                            .ThenInclude(ptc => ptc.CdtCode);

            var treatmentPlans = await query
                .OrderBy(tp => tp.CreatedAt)
                .Select(tp => new RetrievePatientTreatmentPlanDto
                {
                    TreatmentPlanId = tp.TreatmentPlanId,
                    Description = tp.Description,
                    ProcedureSubcategoryId = tp.ProcedureSubcategoryId,
                    CreatedUserId = tp.CreatedUserId,
                    CreatedAt = tp.CreatedAt,
                    PayerId = tp.PayerId,
                    PatientName = tp.Patient != null ? (tp.Patient.FirstName ?? "") + " " + (tp.Patient.LastName ?? "") : "",
                    Visits = tp.Visits.Select(v => new RetrieveVisitDto
                    {
                        VisitId = v.VisitId,
                        Description = v.Description,
                        VisitNumber = v.VisitNumber,
                        Procedures = MapVisitToProcedureMapsToDto(v.VisitToProcedureMaps) 
                    }).ToList()
                })
                .ToListAsync();

            return treatmentPlans;
        }




        public async Task<IEnumerable<RetrievePatientTreatmentPlanDto>> GetTreatmentPlansByPatientIdAsync(int patientId, int? facilityId)
        {
            IQueryable<TreatmentPlan> query = _context.TreatmentPlans
                .Where(tp => tp.PatientId == patientId &&
                             (facilityId == null || tp.FacilityId == facilityId))
                .Include(tp => tp.Visits)
                    .ThenInclude(v => v.VisitToProcedureMaps)
                        .ThenInclude(vtp => vtp.ProcedureToCdtMaps)
                            .ThenInclude(ptc => ptc.CdtCode);

            var treatmentPlans = await query
                .Select(tp => new RetrievePatientTreatmentPlanDto
                {
                    TreatmentPlanId = tp.TreatmentPlanId,
                    ProcedureSubcategoryId = tp.ProcedureSubcategoryId,
                    CreatedUserId = tp.CreatedUserId,
                    CreatedAt = tp.CreatedAt,
                    PayerId = tp.PayerId,

                    Visits = tp.Visits.Select(v => new RetrieveVisitDto
                    {
                        VisitId = v.VisitId,
                        Description = v.Description,
                        VisitNumber = v.VisitNumber,

                        // Adjust the DTO mapping for the new structure
                        Procedures = v.VisitToProcedureMaps.Select(vtp => new VisitToProcedureMapDto
                        {
                            Order = vtp.Order,
                            ProcedureTypeId = vtp.ProcedureTypeId,
                            ToothNumber = vtp.ToothNumber,
                            Surface = vtp.Surface,
                            Arch = vtp.Arch,
                            ProcedureToCdtMaps = vtp.ProcedureToCdtMaps.Select(ptc => new ProcedureToCdtMapDto
                            {
                                ProcedureToCdtMapId = ptc.ProcedureToCdtMapId,
                                CdtCodeId = ptc.CdtCode.CdtCodeId,
                                UserDescription = ptc.UserDescription,
                                Default = ptc.Default,
                                Code = ptc.CdtCode.Code,
                                LongDescription = ptc.CdtCode.LongDescription
                            }).ToList()
                        }).ToList()
                    }).ToList()
                })
                .ToListAsync();

            return treatmentPlans;
        }


        public async Task<IEnumerable<CdtCodeDto>> GetAllDefaultCdtCodesAsync()
        {
            return await _context.CdtCodes
                .Where(cdtCode => cdtCode.FacilityId == null)
                .Select(cdtCode => new CdtCodeDto
                {
                    CdtCodeId = cdtCode.CdtCodeId,
                    Code = cdtCode.Code,
                    FacilityId = cdtCode.FacilityId,
                    LongDescription = cdtCode.LongDescription,
                    CdtCodeSubcategoryId = cdtCode.CdtCodeSubcategoryId,
                    CdtCodeCategoryId = cdtCode.CdtCodeCategoryId,
                    CdtCodeCategoryName = cdtCode.CdtCodeCategory.Name
                })
                .ToListAsync();
        }

    }

}


