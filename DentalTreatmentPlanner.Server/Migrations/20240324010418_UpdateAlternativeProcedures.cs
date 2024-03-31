using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DentalTreatmentPlanner.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAlternativeProcedures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AlternativeProcedures_VisitCdtCodeMapId",
                table: "AlternativeProcedures");

            migrationBuilder.AddColumn<int>(
                name: "AlternativeProcedureId",
                table: "visit_cdt_code_map",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AlternativeProcedureCdtCodeId",
                table: "AlternativeProcedures",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DefaultCdtCodeId",
                table: "AlternativeProcedures",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AlternativeProcedures_DefaultCdtCodeId",
                table: "AlternativeProcedures",
                column: "DefaultCdtCodeId");

            migrationBuilder.CreateIndex(
                name: "IX_AlternativeProcedures_VisitCdtCodeMapId",
                table: "AlternativeProcedures",
                column: "VisitCdtCodeMapId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AlternativeProcedures_cdt_code_DefaultCdtCodeId",
                table: "AlternativeProcedures",
                column: "DefaultCdtCodeId",
                principalTable: "cdt_code",
                principalColumn: "cdt_code_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AlternativeProcedures_cdt_code_DefaultCdtCodeId",
                table: "AlternativeProcedures");

            migrationBuilder.DropIndex(
                name: "IX_AlternativeProcedures_DefaultCdtCodeId",
                table: "AlternativeProcedures");

            migrationBuilder.DropIndex(
                name: "IX_AlternativeProcedures_VisitCdtCodeMapId",
                table: "AlternativeProcedures");

            migrationBuilder.DropColumn(
                name: "AlternativeProcedureId",
                table: "visit_cdt_code_map");

            migrationBuilder.DropColumn(
                name: "AlternativeProcedureCdtCodeId",
                table: "AlternativeProcedures");

            migrationBuilder.DropColumn(
                name: "DefaultCdtCodeId",
                table: "AlternativeProcedures");

            migrationBuilder.CreateIndex(
                name: "IX_AlternativeProcedures_VisitCdtCodeMapId",
                table: "AlternativeProcedures",
                column: "VisitCdtCodeMapId");
        }
    }
}
