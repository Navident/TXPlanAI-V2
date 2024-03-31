using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DentalTreatmentPlanner.Server.Migrations
{
    /// <inheritdoc />
    public partial class personalchangesv2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VisitCdtCodeMap_ChosenAltCdtCode",
                table: "visit_cdt_code_map");

            migrationBuilder.RenameColumn(
                name: "ChosenAltCdtCodeId",
                table: "visit_cdt_code_map",
                newName: "ChosenDefToAltProcMapId");

            migrationBuilder.RenameIndex(
                name: "IX_visit_cdt_code_map_ChosenAltCdtCodeId",
                table: "visit_cdt_code_map",
                newName: "IX_visit_cdt_code_map_ChosenDefToAltProcMapId");

            migrationBuilder.AddColumn<int>(
                name: "ChosenAltCdtCodeCdtCodeId",
                table: "visit_cdt_code_map",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_visit_cdt_code_map_ChosenAltCdtCodeCdtCodeId",
                table: "visit_cdt_code_map",
                column: "ChosenAltCdtCodeCdtCodeId");

            migrationBuilder.AddForeignKey(
                name: "FK_VisitCdtCodeMap_ChosenDefToAltProcMap",
                table: "visit_cdt_code_map",
                column: "ChosenDefToAltProcMapId",
                principalTable: "DefToAltProcMap",
                principalColumn: "DefToAltProcMapId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_visit_cdt_code_map_cdt_code_ChosenAltCdtCodeCdtCodeId",
                table: "visit_cdt_code_map",
                column: "ChosenAltCdtCodeCdtCodeId",
                principalTable: "cdt_code",
                principalColumn: "cdt_code_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VisitCdtCodeMap_ChosenDefToAltProcMap",
                table: "visit_cdt_code_map");

            migrationBuilder.DropForeignKey(
                name: "FK_visit_cdt_code_map_cdt_code_ChosenAltCdtCodeCdtCodeId",
                table: "visit_cdt_code_map");

            migrationBuilder.DropIndex(
                name: "IX_visit_cdt_code_map_ChosenAltCdtCodeCdtCodeId",
                table: "visit_cdt_code_map");

            migrationBuilder.DropColumn(
                name: "ChosenAltCdtCodeCdtCodeId",
                table: "visit_cdt_code_map");

            migrationBuilder.RenameColumn(
                name: "ChosenDefToAltProcMapId",
                table: "visit_cdt_code_map",
                newName: "ChosenAltCdtCodeId");

            migrationBuilder.RenameIndex(
                name: "IX_visit_cdt_code_map_ChosenDefToAltProcMapId",
                table: "visit_cdt_code_map",
                newName: "IX_visit_cdt_code_map_ChosenAltCdtCodeId");

            migrationBuilder.AddForeignKey(
                name: "FK_VisitCdtCodeMap_ChosenAltCdtCode",
                table: "visit_cdt_code_map",
                column: "ChosenAltCdtCodeId",
                principalTable: "cdt_code",
                principalColumn: "cdt_code_id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
