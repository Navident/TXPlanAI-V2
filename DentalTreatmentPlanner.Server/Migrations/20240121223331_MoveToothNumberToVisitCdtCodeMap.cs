using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DentalTreatmentPlanner.Server.Migrations
{
    /// <inheritdoc />
    public partial class MoveToothNumberToVisitCdtCodeMap : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "tooth_number",
                table: "treatment_plan");

            migrationBuilder.AddColumn<int>(
                name: "tooth_number",
                table: "visit_cdt_code_map",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "tooth_number",
                table: "visit_cdt_code_map");

            migrationBuilder.AddColumn<int>(
                name: "tooth_number",
                table: "treatment_plan",
                type: "int",
                nullable: true);
        }
    }
}
