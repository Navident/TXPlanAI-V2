namespace DentalTreatmentPlanner.Server.Dtos
{
    public class UpdateVisitDto
    {
        public int? VisitId { get; set; }
        public string? Description { get; set; }
        public int VisitNumber { get; set; }  

        public ICollection<VisitToProcedureMapDto> VisitToProcedureMapDtos { get; set; }

    }
}
