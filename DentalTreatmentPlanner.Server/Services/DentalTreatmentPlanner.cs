using DentalTreatmentPlanner.Server.Data;
using DentalTreatmentPlanner.Server.Models;
using DentalTreatmentPlanner.Server.Dtos;
using Microsoft.EntityFrameworkCore;

namespace DentalTreatmentPlanner.Server.Services
{
    public class DentalTreatmentPlannerService
    {
        private readonly ApplicationDbContext _context;
        int defaultProcedureTypeId = 0;

        public DentalTreatmentPlannerService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<TreatmentPlanDto> GetTreatmentPlanAsync(int treatmentPlanId)
        {
            // LINQ query to join the tables and retrieve the treatment plan
            var treatmentPlan = await _context.TreatmentPlans
                .Where(tp => tp.TreatmentPlanId == treatmentPlanId)
                .Select(tp => new TreatmentPlanDto
                {
                    TreatmentPlanId = tp.TreatmentPlanId,
                    Description = tp.Description,
                    ProcedureCategoryId = tp.ProcedureCategoryId,
                    ToothNumber = tp.ToothNumber,
                    
                    Visits = tp.Visits.Select(v => new VisitDto
                    {
                        VisitId = v.VisitId,
                        Description = v.Description,
                        VisitNumber = v.VisitNumber,

                        CdtCodes = v.VisitCdtCodeMaps.Select(vc => new VisitCdtCodeMapDto
                        {
                            CdtCodeId = vc.CdtCode.CdtCodeId,
                            Order = vc.Order,
                            ProcedureTypeId = vc.ProcedureTypeId,
                            // Map other properties needed from CdtCodeDto if necessary
                            Code = vc.CdtCode.Code,

                        }).ToList()
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            return treatmentPlan; // The retrieved treatment plan DTO
        }
        public async Task<IEnumerable<TreatmentPlanDto>> GetTreatmentPlansAsync()
        {
            // LINQ query to get all treatment plans and project them to TreatmentPlanDto
            var treatmentPlans = await _context.TreatmentPlans
                .Select(tp => new TreatmentPlanDto
                {
                    TreatmentPlanId = tp.TreatmentPlanId,
                    Description = tp.Description,
                    ProcedureCategoryId = tp.ProcedureCategoryId,
                    ToothNumber = tp.ToothNumber,

                    // Map visits and CDT codes
                    Visits = tp.Visits.Select(v => new VisitDto
                    {
                        VisitId = v.VisitId,
                        Description = v.Description,
                        VisitNumber = v.VisitNumber,

                        CdtCodes = v.VisitCdtCodeMaps.Select(vc => new VisitCdtCodeMapDto
                        {
                            CdtCodeId = vc.CdtCode.CdtCodeId,
                            Order = vc.Order,
                            ProcedureTypeId = vc.ProcedureTypeId,
                            Code = vc.CdtCode.Code,
                        }).ToList()
                    }).ToList()
                })
                .ToListAsync();

            return treatmentPlans;
        }
        public async Task<TreatmentPlan> CreateTreatmentPlanAsync(TreatmentPlanDto treatmentPlanDto)
        {
            // Create a new TreatmentPlan instance from the DTO
            var treatmentPlan = new TreatmentPlan
            {
                Description = treatmentPlanDto.Description,
                ProcedureCategoryId = treatmentPlanDto.ProcedureCategoryId, 
                ToothNumber = treatmentPlanDto.ToothNumber, 
                FacilityProviderMapId = treatmentPlanDto.FacilityProviderMapId, 
                CreatedUserId = treatmentPlanDto.CreatedUserId 
            };

            // Add the TreatmentPlan to the context
            _context.TreatmentPlans.Add(treatmentPlan);

            // Save changes to get the TreatmentPlanId
            await _context.SaveChangesAsync();

 
            foreach (var visitDto in treatmentPlanDto.Visits)
            {
                var visit = new Visit
                {
                    TreatmentPlanId = treatmentPlan.TreatmentPlanId,
                    Description = visitDto.Description,
                    VisitNumber = visitDto.VisitNumber,
                    CreatedUserId = treatmentPlanDto.CreatedUserId 
                };
                _context.Visits.Add(visit);

                await _context.SaveChangesAsync();

                foreach (var cdtCodeDto in visitDto.CdtCodes)
                {
                    var visitCdtCodeMap = new VisitCdtCodeMap
                    {
                        VisitId = visit.VisitId,
                        CdtCodeId = cdtCodeDto.CdtCodeId,
                        Order = cdtCodeDto.Order,
                        ProcedureTypeId = cdtCodeDto.ProcedureTypeId ?? defaultProcedureTypeId 
                    };

                    _context.VisitCdtCodeMaps.Add(visitCdtCodeMap);
                }
            }

            await _context.SaveChangesAsync();
            return treatmentPlan; 
        }
    }

}
