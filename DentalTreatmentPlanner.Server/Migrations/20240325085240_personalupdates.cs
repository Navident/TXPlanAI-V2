using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DentalTreatmentPlanner.Server.Migrations
{
    /// <inheritdoc />
    public partial class personalupdates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__visit_cdt__cdt_c__05D8E0BE", 
                table: "visit_cdt_code_map");

            migrationBuilder.AddColumn<int>(
                name: "ChosenAltCdtCodeId",
                table: "visit_cdt_code_map",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_visit_cdt_code_map_ChosenAltCdtCodeId",
                table: "visit_cdt_code_map",
                column: "ChosenAltCdtCodeId");

            migrationBuilder.AddForeignKey(
                name: "FK_VisitCdtCodeMap_CdtCode",
                table: "visit_cdt_code_map",
                column: "cdt_code_id",
                principalTable: "cdt_code",
                principalColumn: "cdt_code_id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_VisitCdtCodeMap_ChosenAltCdtCode",
                table: "visit_cdt_code_map",
                column: "ChosenAltCdtCodeId",
                principalTable: "cdt_code",
                principalColumn: "cdt_code_id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VisitCdtCodeMap_CdtCode",
                table: "visit_cdt_code_map");

            migrationBuilder.DropForeignKey(
                name: "FK_VisitCdtCodeMap_ChosenAltCdtCode",
                table: "visit_cdt_code_map");

            migrationBuilder.DropIndex(
                name: "IX_visit_cdt_code_map_ChosenAltCdtCodeId",
                table: "visit_cdt_code_map");

            migrationBuilder.DropColumn(
                name: "ChosenAltCdtCodeId",
                table: "visit_cdt_code_map");

            migrationBuilder.AddForeignKey(
                name: "FK_visit_cdt_code_map_cdt_code_cdt_code_id",
                table: "visit_cdt_code_map",
                column: "cdt_code_id",
                principalTable: "cdt_code",
                principalColumn: "cdt_code_id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
