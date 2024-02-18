namespace DentalTreatmentPlanner.Server.Dtos
{
    public class CreateNewTxPlanFromDefaultDto
    {
        public string Description { get; set; }
        public int ProcedureSubcategoryId { get; set; }
        public List<NewTxFromDefaultVisitDto> Visits { get; set; } = new List<NewTxFromDefaultVisitDto>();
    }
}
