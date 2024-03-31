namespace DentalTreatmentPlanner.Server.Dtos
{
    public class CreateNewTxPlanFromDefaultDto
    {
        public int ProcedureSubcategoryId { get; set; }
        public List<NewTxFromDefaultVisitDto> Visits { get; set; } = new List<NewTxFromDefaultVisitDto>();
    }
}
