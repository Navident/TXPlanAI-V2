using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DentalTreatmentPlanner.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddTreatmentPhaseToVisitCdtCodeMap : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TreatmentPhaseId",
                table: "visit_cdt_code_map",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_visit_cdt_code_map_TreatmentPhaseId",
                table: "visit_cdt_code_map",
                column: "TreatmentPhaseId");

            migrationBuilder.AddForeignKey(
                name: "FK_visit_cdt_code_map_TreatmentPhases_TreatmentPhaseId",
                table: "visit_cdt_code_map",
                column: "TreatmentPhaseId",
                principalTable: "TreatmentPhases",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_visit_cdt_code_map_TreatmentPhases_TreatmentPhaseId",
                table: "visit_cdt_code_map");

            migrationBuilder.DropIndex(
                name: "IX_visit_cdt_code_map_TreatmentPhaseId",
                table: "visit_cdt_code_map");

            migrationBuilder.DropColumn(
                name: "TreatmentPhaseId",
                table: "visit_cdt_code_map");
        }
    }
}
