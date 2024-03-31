using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DentalTreatmentPlanner.Server.Migrations
{
    /// <inheritdoc />
    public partial class changeAltProcTableName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AlternativeProcedures_cdt_code_AlternativeProcedureCdtCodeId",
                table: "AlternativeProcedures");

            migrationBuilder.DropForeignKey(
                name: "FK_AlternativeProcedures_cdt_code_DefaultCdtCodeId",
                table: "AlternativeProcedures");

            migrationBuilder.DropForeignKey(
                name: "FK_visit_cdt_code_map_AlternativeProcedures_DefToAltProcMapId",
                table: "visit_cdt_code_map");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AlternativeProcedures",
                table: "AlternativeProcedures");

            migrationBuilder.RenameTable(
                name: "AlternativeProcedures",
                newName: "DefToAltProcMap");

            migrationBuilder.RenameIndex(
                name: "IX_AlternativeProcedures_DefaultCdtCodeId",
                table: "DefToAltProcMap",
                newName: "IX_DefToAltProcMap_DefaultCdtCodeId");

            migrationBuilder.RenameIndex(
                name: "IX_AlternativeProcedures_AlternativeProcedureCdtCodeId",
                table: "DefToAltProcMap",
                newName: "IX_DefToAltProcMap_AlternativeProcedureCdtCodeId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DefToAltProcMap",
                table: "DefToAltProcMap",
                column: "DefToAltProcMapId");

            migrationBuilder.AddForeignKey(
                name: "FK_DefToAltProcMap_cdt_code_AlternativeProcedureCdtCodeId",
                table: "DefToAltProcMap",
                column: "AlternativeProcedureCdtCodeId",
                principalTable: "cdt_code",
                principalColumn: "cdt_code_id");

            migrationBuilder.AddForeignKey(
                name: "FK_DefToAltProcMap_cdt_code_DefaultCdtCodeId",
                table: "DefToAltProcMap",
                column: "DefaultCdtCodeId",
                principalTable: "cdt_code",
                principalColumn: "cdt_code_id");

            migrationBuilder.AddForeignKey(
                name: "FK_visit_cdt_code_map_DefToAltProcMap_DefToAltProcMapId",
                table: "visit_cdt_code_map",
                column: "DefToAltProcMapId",
                principalTable: "DefToAltProcMap",
                principalColumn: "DefToAltProcMapId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DefToAltProcMap_cdt_code_AlternativeProcedureCdtCodeId",
                table: "DefToAltProcMap");

            migrationBuilder.DropForeignKey(
                name: "FK_DefToAltProcMap_cdt_code_DefaultCdtCodeId",
                table: "DefToAltProcMap");

            migrationBuilder.DropForeignKey(
                name: "FK_visit_cdt_code_map_DefToAltProcMap_DefToAltProcMapId",
                table: "visit_cdt_code_map");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DefToAltProcMap",
                table: "DefToAltProcMap");

            migrationBuilder.RenameTable(
                name: "DefToAltProcMap",
                newName: "AlternativeProcedures");

            migrationBuilder.RenameIndex(
                name: "IX_DefToAltProcMap_DefaultCdtCodeId",
                table: "AlternativeProcedures",
                newName: "IX_AlternativeProcedures_DefaultCdtCodeId");

            migrationBuilder.RenameIndex(
                name: "IX_DefToAltProcMap_AlternativeProcedureCdtCodeId",
                table: "AlternativeProcedures",
                newName: "IX_AlternativeProcedures_AlternativeProcedureCdtCodeId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AlternativeProcedures",
                table: "AlternativeProcedures",
                column: "DefToAltProcMapId");

            migrationBuilder.AddForeignKey(
                name: "FK_AlternativeProcedures_cdt_code_AlternativeProcedureCdtCodeId",
                table: "AlternativeProcedures",
                column: "AlternativeProcedureCdtCodeId",
                principalTable: "cdt_code",
                principalColumn: "cdt_code_id");

            migrationBuilder.AddForeignKey(
                name: "FK_AlternativeProcedures_cdt_code_DefaultCdtCodeId",
                table: "AlternativeProcedures",
                column: "DefaultCdtCodeId",
                principalTable: "cdt_code",
                principalColumn: "cdt_code_id");

            migrationBuilder.AddForeignKey(
                name: "FK_visit_cdt_code_map_AlternativeProcedures_DefToAltProcMapId",
                table: "visit_cdt_code_map",
                column: "DefToAltProcMapId",
                principalTable: "AlternativeProcedures",
                principalColumn: "DefToAltProcMapId");
        }
    }
}
