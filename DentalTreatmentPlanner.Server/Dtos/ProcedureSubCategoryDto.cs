namespace DentalTreatmentPlanner.Server.Dtos
{
    public class ProcedureSubCategoryDto
    {
        public int ProcedureSubCategoryId { get; set; }
        public string Name { get; set; }
        public int ProcedureCategoryId { get; set; } 
        public string ProcedureCategoryName { get; set; } 
    }


}
