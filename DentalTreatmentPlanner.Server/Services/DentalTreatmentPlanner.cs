using DentalTreatmentPlanner.Server.Data;
using DentalTreatmentPlanner.Server.Models;
using DentalTreatmentPlanner.Server.Dtos;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace DentalTreatmentPlanner.Server.Services
{
    public class DentalTreatmentPlannerService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager; 
        private readonly SignInManager<ApplicationUser> _signInManager;

        public DentalTreatmentPlannerService(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager, 
            SignInManager<ApplicationUser> signInManager 
        )
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
        }

        public List<Patient> GetMockPatients()
        {
            return new List<Patient>
            {
                new Patient { PatientId = 1, FirstName = "John", LastName = "Smith", FacilityId = 1, DateOfBirth = new DateTime(1980, 1, 1) },
                new Patient { PatientId = 2, FirstName = "Jane", LastName = "Doe", FacilityId = 1, DateOfBirth = new DateTime(1985, 5, 23) },

            };
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

            return newPatient; // This patient now includes the PatientId set by the database
        }



        public async Task<List<Patient>> GetPatientsByFacility(int facilityId)
        {
            return await _context.Patients.Where(p => p.FacilityId == facilityId).ToListAsync();
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

        public async Task<(Microsoft.AspNetCore.Identity.SignInResult, ApplicationUser, string)> LoginUserAsync(LoginUserDto loginUserDto)
        {
            var result = await _signInManager.PasswordSignInAsync(loginUserDto.Email, loginUserDto.Password, loginUserDto.RememberMe, lockoutOnFailure: false);

            if (result.Succeeded)
            {
                var user = await _userManager.FindByEmailAsync(loginUserDto.Email);

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

                return (result, user, facilityName); // Return the sign-in result, user details, and facility name
            }
            else
            {
                Console.WriteLine($"Login failed for user with email: {loginUserDto.Email}");
                return (result, null, null);
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
                    Description = tp.Description,
                    ProcedureSubcategoryId = tp.ProcedureSubcategoryId,

                    // Mapping each visit of the treatment plan to a VisitDto
                    Visits = tp.Visits.Select(v => new RetrieveVisitDto
                    {
                        VisitId = v.VisitId,
                        Description = v.Description,
                        VisitNumber = v.VisitNumber,

                        // Mapping CDT codes associated with each visit
                        CdtCodes = v.VisitCdtCodeMaps.Select(vc => new VisitCdtCodeMapDto
                        {
                            CdtCodeId = vc.CdtCode.CdtCodeId,
                            Order = vc.Order,
                            ProcedureTypeId = vc.ProcedureTypeId,
                            ToothNumber = vc.ToothNumber,
                            Code = vc.CdtCode.Code,
                            LongDescription = vc.CdtCode.LongDescription

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

                    // Mapping the visits and associated CDT codes for each treatment plan
                    Visits = tp.Visits.Select(v => new RetrieveVisitDto
                    {
                        VisitId = v.VisitId,
                        Description = v.Description,
                        VisitNumber = v.VisitNumber,

                        // Including CDT code details for each visit
                        CdtCodes = v.VisitCdtCodeMaps.Select(vc => new VisitCdtCodeMapDto
                        {
                            CdtCodeId = vc.CdtCode.CdtCodeId,
                            Order = vc.Order,
                            ProcedureTypeId = vc.ProcedureTypeId,
                            ToothNumber = vc.ToothNumber,
                            Code = vc.CdtCode.Code,
                            LongDescription = vc.CdtCode.LongDescription
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
                    // Finding the corresponding procedure category
                    var procedureSubCategory = await _context.ProcedureSubCategories
                        .FirstOrDefaultAsync(pc => pc.Name == treatmentPlanDto.Description);

                    // Creating a new treatment plan 
                    var treatmentPlan = new TreatmentPlan
                    {
                        Description = treatmentPlanDto.Description,
                        ProcedureSubcategoryId = procedureSubCategory.ProcedureSubCategoryId,
                        CreatedUserId = treatmentPlanDto.CreatedUserId
                    };

                    _context.TreatmentPlans.Add(treatmentPlan);
                    await _context.SaveChangesAsync();

                    // Process each user defined visit from the DTO
                    foreach (var visitDto in treatmentPlanDto.Visits)
                    {
                        var visit = new Visit
                        {
                            TreatmentPlanId = treatmentPlan.TreatmentPlanId,
                            Description = visitDto.Description
                        };

                        _context.Visits.Add(visit);
                        await _context.SaveChangesAsync();

                        // For each CDT code in the visit
                        foreach (var visitCdtCodeMapDto in visitDto.VisitCdtCodeMaps)
                        {
                            var visitCdtCodeMap = new VisitCdtCodeMap
                            {
                                VisitId = visit.VisitId,
                                CdtCodeId = visitCdtCodeMapDto.CdtCodeId,
                                Order = visitCdtCodeMapDto.Order,
                                ProcedureTypeId = visitCdtCodeMapDto.ProcedureTypeId,
                                TreatmentPhaseId = visitCdtCodeMapDto.TreatmentPhaseId,
                                ToothNumber = visitCdtCodeMapDto.ToothNumber 
                            };

                            _context.VisitCdtCodeMaps.Add(visitCdtCodeMap);
                        }
                    }

                    await _context.SaveChangesAsync();

                    // Loading the visit and CDT code details into the treatment plan
                    _context.Entry(treatmentPlan).Collection(tp => tp.Visits).Load();
                    foreach (var visit in treatmentPlan.Visits)
                    {
                        _context.Entry(visit).Collection(v => v.VisitCdtCodeMaps).Load();
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

        public async Task<List<VisitCdtCodeMapDto>> CreateNewProceduresAsync(List<NewProcedureDto> newProcedures)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var newCdtCodeMaps = new List<VisitCdtCodeMap>();

                    foreach (var newProc in newProcedures)
                    {
                        Console.Write($"Creating new VisitCdtCodeMap with VisitId: {newProc.VisitId}, CdtCodeId: {newProc.CdtCodeId}, Order: {newProc.Order}");
                        var newCdtCodeMap = new VisitCdtCodeMap
                        {
                            VisitId = newProc.VisitId,
                            CdtCodeId = newProc.CdtCodeId,
                            Order = newProc.Order
                        };

                        newCdtCodeMaps.Add(newCdtCodeMap);
                    }

                    _context.VisitCdtCodeMaps.AddRange(newCdtCodeMaps);
                    await _context.SaveChangesAsync();

                    var newCdtCodeMapDtos = newCdtCodeMaps.Select(c => new VisitCdtCodeMapDto
                    {
                        VisitCdtCodeMapId = c.VisitCdtCodeMapId,
                        VisitId = c.VisitId,
                        CdtCodeId = c.CdtCodeId,
                        Order = c.Order
                    }).ToList();

                    await transaction.CommitAsync();
                    return newCdtCodeMapDtos;
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
                            .ThenInclude(v => v.VisitCdtCodeMaps)
                        .FirstOrDefaultAsync(tp => tp.TreatmentPlanId == updateTreatmentPlanDto.TreatmentPlanId);

                    if (treatmentPlan == null)
                    {
                        throw new KeyNotFoundException("Treatment plan not found.");
                    }

                    treatmentPlan.Description = updateTreatmentPlanDto.Description;
                    treatmentPlan.ProcedureSubcategoryId = updateTreatmentPlanDto.ProcedureSubcategoryId;

                    foreach (var visitDto in updateTreatmentPlanDto.Visits)
                    {
                        var visit = treatmentPlan.Visits.FirstOrDefault(v => v.VisitId == visitDto.VisitId);
                        if (visit != null)
                        {
                            visit.Description = visitDto.Description;
                            visit.VisitNumber = visitDto.VisitNumber;
                            UpdateVisitCdtCodes(visit, visitDto.VisitCdtCodeMaps);
                        }
                    }

                    foreach (var deletedVisitId in updateTreatmentPlanDto.DeletedVisitIds)
                    {
                        var visitToDelete = treatmentPlan.Visits.FirstOrDefault(v => v.VisitId == deletedVisitId);
                        if (visitToDelete != null)
                        {
                            // First, delete the VisitCdtCodeMap entries for this visit
                            foreach (var cdtCodeMap in visitToDelete.VisitCdtCodeMaps.ToList())
                            {
                                _context.VisitCdtCodeMaps.Remove(cdtCodeMap);
                            }

                            // Then, delete the visit itself
                            _context.Visits.Remove(visitToDelete);
                        }
                    }

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

        public async Task<TreatmentPlan> CreateNewTreatmentPlanFromDefaultAsync(UpdateTreatmentPlanDto updateTreatmentPlanDto, int facilityId)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Create a new treatment plan based on the default
                    TreatmentPlan newTreatmentPlan = new TreatmentPlan
                    {
                        Description = updateTreatmentPlanDto.Description,
                        ProcedureSubcategoryId = updateTreatmentPlanDto.ProcedureSubcategoryId,
                        FacilityId = facilityId,
                    };

                    foreach (var visitDto in updateTreatmentPlanDto.Visits)
                    {
                        Visit newVisit = new Visit
                        {
                            Description = visitDto.Description,
                            VisitNumber = visitDto.VisitNumber,
                            VisitCdtCodeMaps = new List<VisitCdtCodeMap>(),
                        };

                        foreach (var visitCdtCodeMapDto in visitDto.VisitCdtCodeMaps)
                        {
                            VisitCdtCodeMap newProcedure = new VisitCdtCodeMap
                            {
                                CdtCodeId = visitCdtCodeMapDto.CdtCodeId,
                                Order = visitCdtCodeMapDto.Order,
                                ProcedureTypeId = visitCdtCodeMapDto.ProcedureTypeId,
                                TreatmentPhaseId = visitCdtCodeMapDto.TreatmentPhaseId,
                                ToothNumber = visitCdtCodeMapDto.ToothNumber,
                                                                             
                            };
                            newVisit.VisitCdtCodeMaps.Add(newProcedure);
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

        public async Task<TreatmentPlan> CreateNewTreatmentPlanForPatientFromCombinedAsync(UpdateTreatmentPlanDto updateTreatmentPlanDto, int facilityId)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Create a new treatment plan based on the default
                    TreatmentPlan newTreatmentPlan = new TreatmentPlan
                    {
                        Description = updateTreatmentPlanDto.Description,
                        ProcedureSubcategoryId = null,
                        FacilityId = facilityId,
                        PatientId = updateTreatmentPlanDto.PatientId,
                    };

                    foreach (var visitDto in updateTreatmentPlanDto.Visits)
                    {
                        Visit newVisit = new Visit
                        {
                            Description = visitDto.Description,
                            VisitNumber = visitDto.VisitNumber,
                            VisitCdtCodeMaps = new List<VisitCdtCodeMap>(),
                        };

                        foreach (var visitCdtCodeMapDto in visitDto.VisitCdtCodeMaps)
                        {
                            VisitCdtCodeMap newProcedure = new VisitCdtCodeMap
                            {
                                CdtCodeId = visitCdtCodeMapDto.CdtCodeId,
                                Order = visitCdtCodeMapDto.Order,
                                ToothNumber = visitCdtCodeMapDto.ToothNumber, 
                            };
                            newVisit.VisitCdtCodeMaps.Add(newProcedure);
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

        private void UpdateVisitCdtCodes(Visit visit, ICollection<VisitCdtCodeMapDto> updatedCdtCodeMaps)
        {
            // Update existing VisitCdtCodeMaps
            foreach (var cdtCodeMapDto in updatedCdtCodeMaps)
            {
                var cdtCodeMap = visit.VisitCdtCodeMaps.FirstOrDefault(c => c.VisitCdtCodeMapId == cdtCodeMapDto.VisitCdtCodeMapId);
                if (cdtCodeMap != null)
                {
                    cdtCodeMap.Order = cdtCodeMapDto.Order;
                    cdtCodeMap.TreatmentPhaseId = cdtCodeMapDto.TreatmentPhaseId;
                    cdtCodeMap.ToothNumber = cdtCodeMapDto.ToothNumber;
                                                                       
                }
            }
            // Remove VisitCdtCodeMaps that are no longer in the updated list
            var cdtCodeMapsToRemove = visit.VisitCdtCodeMaps
                .Where(c => !updatedCdtCodeMaps.Any(uc => uc.VisitCdtCodeMapId == c.VisitCdtCodeMapId))
                .ToList();

            foreach (var cdtCodeMap in cdtCodeMapsToRemove)
            {
                _context.VisitCdtCodeMaps.Remove(cdtCodeMap);
            }
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

            // First, try to get a facility-specific plan if facilityId is not null
            IQueryable<TreatmentPlan> query = _context.TreatmentPlans
                .Where(tp => tp.ProcedureSubcategoryId == subcategoryId &&
                             (facilityId != null && tp.FacilityId == facilityId) &&
                             tp.PatientId == null);

            // Check if any facility-specific plans are found, if not, get the default plan
            if (facilityId != null && !await query.AnyAsync())
            {
                query = _context.TreatmentPlans
                    .Where(tp => tp.ProcedureSubcategoryId == subcategoryId &&
                                 tp.FacilityId == null &&
                                 tp.PatientId == null);
            }

            var treatmentPlans = await query
                .Select(tp => new RetrieveTreatmentPlanDto
                {
                    TreatmentPlanId = tp.TreatmentPlanId,
                    Description = tp.Description,
                    ProcedureSubcategoryId = tp.ProcedureSubcategoryId,
                    FacilityId = tp.FacilityId,
                    CreatedUserId = tp.CreatedUserId,
                    ProcedureCategoryName = tp.ProcedureSubcategory.ProcedureCategory.Name,

                    // Mapping each visit of the treatment plan to a RetrieveVisitDto
                    Visits = tp.Visits.Select(v => new RetrieveVisitDto
                    {
                        VisitId = v.VisitId,
                        Description = v.Description,
                        VisitNumber = v.VisitNumber,

                        // Mapping CDT codes associated with each visit
                        CdtCodes = v.VisitCdtCodeMaps.Select(vc => new VisitCdtCodeMapDto
                        {
                            VisitCdtCodeMapId = vc.VisitCdtCodeMapId,
                            CdtCodeId = vc.CdtCode.CdtCodeId,
                            Order = vc.Order,
                            ProcedureTypeId = vc.ProcedureTypeId,
                            TreatmentPhaseId = vc.TreatmentPhaseId,
                            ToothNumber = vc.ToothNumber,
                            TreatmentPhaseLabel = vc.TreatmentPhase != null ? vc.TreatmentPhase.Label : null, // Include TreatmentPhase Label
                            Code = vc.CdtCode.Code,
                            LongDescription = vc.CdtCode.LongDescription
                        }).ToList()
                    }).ToList()
                })
    .ToListAsync();
            return treatmentPlans;
        }


        // Method to retrieve treatment plans by patient ID
        public async Task<IEnumerable<RetrievePatientTreatmentPlanDto>> GetTreatmentPlansByPatientIdAsync(int patientId, int? facilityId)
        {
            IQueryable<TreatmentPlan> query = _context.TreatmentPlans
                .Where(tp => tp.PatientId == patientId &&
                             (facilityId != null && tp.FacilityId == facilityId));

            var treatmentPlans = await query
                .Select(tp => new RetrievePatientTreatmentPlanDto
                {
                    TreatmentPlanId = tp.TreatmentPlanId,
                    Description = tp.Description,
                    ProcedureSubcategoryId = tp.ProcedureSubcategoryId,
                    CreatedUserId = tp.CreatedUserId,
                    CreatedAt = tp.CreatedAt,

                    // Mapping each visit of the treatment plan to a RetrieveVisitDto
                    Visits = tp.Visits.Select(v => new RetrieveVisitDto
                    {
                        VisitId = v.VisitId,
                        Description = v.Description,
                        VisitNumber = v.VisitNumber,

                        // Mapping CDT codes associated with each visit
                        CdtCodes = v.VisitCdtCodeMaps.Select(vc => new VisitCdtCodeMapDto
                        {
                            VisitCdtCodeMapId = vc.VisitCdtCodeMapId,
                            CdtCodeId = vc.CdtCode.CdtCodeId,
                            Order = vc.Order,
                            ProcedureTypeId = vc.ProcedureTypeId,
                            ToothNumber = vc.ToothNumber,
                            Code = vc.CdtCode.Code,
                            LongDescription = vc.CdtCode.LongDescription
                        }).ToList()
                    }).ToList()
                })
                .ToListAsync();
            return treatmentPlans;
        }


        public async Task<IEnumerable<CdtCodeDto>> GetAllCdtCodesAsync()
        {
            return await _context.CdtCodes
                .Select(cdtCode => new CdtCodeDto
                {
                    CdtCodeId = cdtCode.CdtCodeId,
                    Code = cdtCode.Code,
                    LongDescription = cdtCode.LongDescription
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<TreatmentPhaseDto>> GetAllTreatmentPhasesAsync()
        {
            return await _context.TreatmentPhases
                .Select(phase => new TreatmentPhaseDto
                {
                    Id = phase.Id,
                    Label = phase.Label,
                    Description = phase.Description,
                    CreatedAt = phase.CreatedAt,
                    ModifiedAt = phase.ModifiedAt
                })
                .ToListAsync();
        }

    }

}


