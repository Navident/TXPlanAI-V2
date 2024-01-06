using DentalTreatmentPlanner.Server.Data;
using DentalTreatmentPlanner.Server.Models;
using DentalTreatmentPlanner.Server.Dtos;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Identity;

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

        public async Task<IdentityResult> RegisterUserAsync(RegisterUserDto registerUserDto)
        {
            if (registerUserDto.Password != registerUserDto.ConfirmPassword)
            {
                return IdentityResult.Failed(new IdentityError { Description = "Passwords do not match" });
            }

            var user = new ApplicationUser
            {
                UserName = registerUserDto.Email,
                Email = registerUserDto.Email,
                PhoneNumber = string.IsNullOrWhiteSpace(registerUserDto.PhoneNumber) ? null : registerUserDto.PhoneNumber,
                BusinessName = registerUserDto.BusinessName
            };

            var result = await _userManager.CreateAsync(user, registerUserDto.Password);

            return result;
        }



        public async Task<(SignInResult, ApplicationUser)> LoginUserAsync(LoginUserDto loginUserDto)
        {
            var result = await _signInManager.PasswordSignInAsync(loginUserDto.Email, loginUserDto.Password, loginUserDto.RememberMe, lockoutOnFailure: false);

            if (result.Succeeded)
            {
                var user = await _userManager.FindByEmailAsync(loginUserDto.Email);
                return (result, user); // Return the sign-in result and the user details
            }

            return (result, null);
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
                    ToothNumber = tp.ToothNumber,

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
                    ToothNumber = tp.ToothNumber,

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
                        ToothNumber = treatmentPlanDto.ToothNumber,
                        FacilityProviderMapId = treatmentPlanDto.FacilityProviderMapId,
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
                        foreach (var cdtCodeId in visitDto.Description) //foreach (var cdtCodeId in visitDto.CdtCodeIds) - this is the correct logic, adding back later

                        {
                            var visitCdtCodeMap = new VisitCdtCodeMap
                            {
                                VisitId = visit.VisitId,
                                CdtCodeId = cdtCodeId,
                                Order = 0, // Adding logic for this later
                                ProcedureTypeId = null //adding logic for this later
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
                    treatmentPlan.ToothNumber = updateTreatmentPlanDto.ToothNumber;

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

        private void UpdateVisitCdtCodes(Visit visit, ICollection<VisitCdtCodeMapDto> updatedCdtCodeMaps)
        {
            // Update existing VisitCdtCodeMaps
            foreach (var cdtCodeMapDto in updatedCdtCodeMaps)
            {
                var cdtCodeMap = visit.VisitCdtCodeMaps.FirstOrDefault(c => c.VisitCdtCodeMapId == cdtCodeMapDto.VisitCdtCodeMapId);
                if (cdtCodeMap != null)
                {
                    cdtCodeMap.Order = cdtCodeMapDto.Order;
                    // Update other fields if necessary
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
        public async Task<IEnumerable<RetrieveTreatmentPlanDto>> GetTreatmentPlansBySubcategoryAsync(string subcategoryName)
        {
            var subcategory = await _context.ProcedureSubCategories
                        .FirstOrDefaultAsync(sc => sc.Name == subcategoryName);

            if (subcategory == null)
            {
                return Enumerable.Empty<RetrieveTreatmentPlanDto>();
            }

            int subcategoryId = subcategory.ProcedureSubCategoryId;

            return await _context.TreatmentPlans
                .Where(tp => tp.ProcedureSubcategoryId == subcategoryId)
                .Select(tp => new RetrieveTreatmentPlanDto
                {
                    TreatmentPlanId = tp.TreatmentPlanId,
                    Description = tp.Description,
                    ProcedureSubcategoryId = tp.ProcedureSubcategoryId,
                    ToothNumber = tp.ToothNumber,
                    FacilityProviderMapId = tp.FacilityProviderMapId,
                    CreatedUserId = tp.CreatedUserId,

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
                            Code = vc.CdtCode.Code,
                            LongDescription = vc.CdtCode.LongDescription
                        }).ToList()
                    }).ToList()
                })
                .ToListAsync();
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



    }

}


