using DentalTreatmentPlanner.Server.Data;
using DentalTreatmentPlanner.Server.Models;
using DentalTreatmentPlanner.Server.Dtos;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace DentalTreatmentPlanner.Server.Services
{
    public class DentalTreatmentPlannerService
    {
        private readonly ApplicationDbContext _context;

        public DentalTreatmentPlannerService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<RetrieveTreatmentPlanDto> GetTreatmentPlanAsync(int treatmentPlanId)
        {
            // Querying the database for a specific treatment plan based on its ID
            var treatmentPlan = await _context.TreatmentPlans
                .Where(tp => tp.TreatmentPlanId == treatmentPlanId)
                .Select(tp => new RetrieveTreatmentPlanDto
                {
                    TreatmentPlanId = tp.TreatmentPlanId,
                    Description = tp.Description,
                    ProcedureCategoryId = tp.ProcedureCategoryId,
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
                    ProcedureCategoryId = tp.ProcedureCategoryId,
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
                    var procedureCategory = await _context.ProcedureCategories
                        .FirstOrDefaultAsync(pc => pc.Name == treatmentPlanDto.Description);

                    // Creating a new treatment plan entity
                    var treatmentPlan = new TreatmentPlan
                    {
                        Description = treatmentPlanDto.Description,
                        ProcedureCategoryId = procedureCategory.ProcedureCategoryId,
                        ToothNumber = treatmentPlanDto.ToothNumber,
                        FacilityProviderMapId = null, //treatmentPlanDto.FacilityProviderMapId, 
                        CreatedUserId = null //treatmentPlanDto.CreatedUserId 

                    };

                    _context.TreatmentPlans.Add(treatmentPlan);
                    await _context.SaveChangesAsync();

                    // Adding visits to the treatment plan
                    List<Visit> addedVisits = new List<Visit>();
                    foreach (var visitDto in treatmentPlanDto.Visits)
                    {
                        var visit = new Visit
                        {
                            TreatmentPlanId = treatmentPlan.TreatmentPlanId,
                            Description = visitDto.Description,
                            VisitNumber = visitDto.VisitNumber,

                        };
                        _context.Visits.Add(visit);
                        addedVisits.Add(visit);
                    }
                    await _context.SaveChangesAsync();

                    // Associating CDT codes with visits based on the procedure category using ProcedureCategoryCdtCodeMaps table 
                    var cdtCodesForCategory = await _context.ProcedureCategoryCdtCodeMaps
                        .Where(map => map.ProcedureCategoryId == treatmentPlan.ProcedureCategoryId)
                        .Select(map => map.CdtCodeId)
                        .ToListAsync();

                    foreach (var visit in addedVisits)
                    {
                        //int order = await GetOrderForVisit(treatmentPlan.ToothNumber, visit.VisitNumber);
                        var visitDto = treatmentPlanDto.Visits.First(v => v.VisitNumber == visit.VisitNumber);
                        foreach (var cdtCodeId in cdtCodesForCategory)
                        {
                            // Creating a mapping for each CDT code and visit
                            var visitCdtCodeMap = new VisitCdtCodeMap
                            {
                                VisitId = visit.VisitId,
                                CdtCodeId = cdtCodeId,
                                Order = 0,
                                ProcedureTypeId = null //cdtCodeDto.ProcedureTypeId
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
        private async Task<int> GetOrderForVisit(int toothNumber, int visitNumber)
        {
            var orderRule = await _context.VisitOrderRules
                .FirstOrDefaultAsync(rule => toothNumber >= rule.ToothNumberRangeStart
                                              && toothNumber <= rule.ToothNumberRangeEnd
                                              && visitNumber == rule.VisitNumber);

            return orderRule != null ? orderRule.OrderValue : 0; // Return the found order, or 0 if no rule matches
        }


    }
}


