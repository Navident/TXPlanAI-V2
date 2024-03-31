using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DentalTreatmentPlanner.Server.Migrations
{
    /// <inheritdoc />
    public partial class revertBackToOldAltProcStructure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_visit_cdt_code_map_AlternativeProcedures_AlternativeProcedureId",
                table: "visit_cdt_code_map");

            migrationBuilder.DropIndex(
                name: "IX_visit_cdt_code_map_AlternativeProcedureId",
                table: "visit_cdt_code_map");

            migrationBuilder.DropColumn(
                name: "AlternativeProcedureId",
                table: "visit_cdt_code_map");

            migrationBuilder.AddColumn<int>(
                name: "VisitCdtCodeMapId",
                table: "AlternativeProcedures",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_AlternativeProcedures_VisitCdtCodeMapId",
                table: "AlternativeProcedures",
                column: "VisitCdtCodeMapId");

            migrationBuilder.AddForeignKey(
                name: "FK_AlternativeProcedures_visit_cdt_code_map_VisitCdtCodeMapId",
                table: "AlternativeProcedures",
                column: "VisitCdtCodeMapId",
                principalTable: "visit_cdt_code_map",
                principalColumn: "visit_cdt_code_map_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AlternativeProcedures_visit_cdt_code_map_VisitCdtCodeMapId",
                table: "AlternativeProcedures");

            migrationBuilder.DropIndex(
                name: "IX_AlternativeProcedures_VisitCdtCodeMapId",
                table: "AlternativeProcedures");

            migrationBuilder.DropColumn(
                name: "VisitCdtCodeMapId",
                table: "AlternativeProcedures");

            migrationBuilder.AddColumn<int>(
                name: "AlternativeProcedureId",
                table: "visit_cdt_code_map",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_visit_cdt_code_map_AlternativeProcedureId",
                table: "visit_cdt_code_map",
                column: "AlternativeProcedureId");

            migrationBuilder.AddForeignKey(
                name: "FK_visit_cdt_code_map_AlternativeProcedures_AlternativeProcedureId",
                table: "visit_cdt_code_map",
                column: "AlternativeProcedureId",
                principalTable: "AlternativeProcedures",
                principalColumn: "AlternativeProcedureId");
        }
    }
}
