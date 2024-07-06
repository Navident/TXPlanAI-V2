using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DentalTreatmentPlanner.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddFacilityToProcedureCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FacilityId",
                table: "procedure_category",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_procedure_category_FacilityId",
                table: "procedure_category",
                column: "FacilityId");

            migrationBuilder.AddForeignKey(
                name: "FK_procedure_category_facility_FacilityId",
                table: "procedure_category",
                column: "FacilityId",
                principalTable: "facility",
                principalColumn: "facility_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_procedure_category_facility_FacilityId",
                table: "procedure_category");

            migrationBuilder.DropIndex(
                name: "IX_procedure_category_FacilityId",
                table: "procedure_category");

            migrationBuilder.DropColumn(
                name: "FacilityId",
                table: "procedure_category");
        }
    }
}
