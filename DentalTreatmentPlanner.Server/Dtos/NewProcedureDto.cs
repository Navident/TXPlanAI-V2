namespace DentalTreatmentPlanner.Server.Dtos
{
    using System.Text.Json.Serialization;

    public class NewProcedureDto
    {
        [JsonPropertyName("visitId")]
        public int VisitId { get; set; }

        [JsonPropertyName("cdtCodeId")]
        public int CdtCodeId { get; set; }

        [JsonPropertyName("order")]
        public int Order { get; set; }
    }


}
