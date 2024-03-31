using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DentalTreatmentPlanner.Server.Migrations
{
    /// <inheritdoc />
    public partial class updateRelationshipsWithAlternativeProc : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AlternativeProcedures_cdt_code_CdtCodeId",
                table: "AlternativeProcedures");

            migrationBuilder.DropForeignKey(
                name: "FK_AlternativeProcedures_visit_cdt_code_map_VisitCdtCodeMapId",
                table: "AlternativeProcedures");

            migrationBuilder.DropIndex(
                name: "IX_AlternativeProcedures_CdtCodeId",
                table: "AlternativeProcedures");

            migrationBuilder.DropIndex(
                name: "IX_AlternativeProcedures_VisitCdtCodeMapId",
                table: "AlternativeProcedures");

            migrationBuilder.DropColumn(
                name: "CdtCodeId",
                table: "AlternativeProcedures");

            migrationBuilder.DropColumn(
                name: "VisitCdtCodeMapId",
                table: "AlternativeProcedures");

            migrationBuilder.AlterColumn<string>(
                name: "UserDescription",
                table: "AlternativeProcedures",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_visit_cdt_code_map_AlternativeProcedureId",
                table: "visit_cdt_code_map",
                column: "AlternativeProcedureId");

            migrationBuilder.CreateIndex(
                name: "IX_AlternativeProcedures_AlternativeProcedureCdtCodeId",
                table: "AlternativeProcedures",
                column: "AlternativeProcedureCdtCodeId");

            migrationBuilder.AddForeignKey(
                name: "FK_AlternativeProcedures_cdt_code_AlternativeProcedureCdtCodeId",
                table: "AlternativeProcedures",
                column: "AlternativeProcedureCdtCodeId",
                principalTable: "cdt_code",
                principalColumn: "cdt_code_id");

            migrationBuilder.AddForeignKey(
                name: "FK_visit_cdt_code_map_AlternativeProcedures_AlternativeProcedureId",
                table: "visit_cdt_code_map",
                column: "AlternativeProcedureId",
                principalTable: "AlternativeProcedures",
                principalColumn: "AlternativeProcedureId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AlternativeProcedures_cdt_code_AlternativeProcedureCdtCodeId",
                table: "AlternativeProcedures");

            migrationBuilder.DropForeignKey(
                name: "FK_visit_cdt_code_map_AlternativeProcedures_AlternativeProcedureId",
                table: "visit_cdt_code_map");

            migrationBuilder.DropIndex(
                name: "IX_visit_cdt_code_map_AlternativeProcedureId",
                table: "visit_cdt_code_map");

            migrationBuilder.DropIndex(
                name: "IX_AlternativeProcedures_AlternativeProcedureCdtCodeId",
                table: "AlternativeProcedures");

            migrationBuilder.AlterColumn<string>(
                name: "UserDescription",
                table: "AlternativeProcedures",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CdtCodeId",
                table: "AlternativeProcedures",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "VisitCdtCodeMapId",
                table: "AlternativeProcedures",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_AlternativeProcedures_CdtCodeId",
                table: "AlternativeProcedures",
                column: "CdtCodeId");

            migrationBuilder.CreateIndex(
                name: "IX_AlternativeProcedures_VisitCdtCodeMapId",
                table: "AlternativeProcedures",
                column: "VisitCdtCodeMapId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AlternativeProcedures_cdt_code_CdtCodeId",
                table: "AlternativeProcedures",
                column: "CdtCodeId",
                principalTable: "cdt_code",
                principalColumn: "cdt_code_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AlternativeProcedures_visit_cdt_code_map_VisitCdtCodeMapId",
                table: "AlternativeProcedures",
                column: "VisitCdtCodeMapId",
                principalTable: "visit_cdt_code_map",
                principalColumn: "visit_cdt_code_map_id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
