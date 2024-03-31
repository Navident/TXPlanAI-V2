using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DentalTreatmentPlanner.Server.Migrations
{
    /// <inheritdoc />
    public partial class test10000 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_visit_cdt_code_map_DefToAltProcMap_DefToAltProcMapId",
                table: "visit_cdt_code_map");

            migrationBuilder.DropIndex(
                name: "IX_visit_cdt_code_map_DefToAltProcMapId",
                table: "visit_cdt_code_map");

            migrationBuilder.DropColumn(
                name: "DefToAltProcMapId",
                table: "visit_cdt_code_map");

            migrationBuilder.AddColumn<int>(
                name: "VisitCdtCodeMapId",
                table: "DefToAltProcMap",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_DefToAltProcMap_VisitCdtCodeMapId",
                table: "DefToAltProcMap",
                column: "VisitCdtCodeMapId");

            migrationBuilder.AddForeignKey(
                name: "FK_DefToAltProcMap_visit_cdt_code_map_VisitCdtCodeMapId",
                table: "DefToAltProcMap",
                column: "VisitCdtCodeMapId",
                principalTable: "visit_cdt_code_map",
                principalColumn: "visit_cdt_code_map_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DefToAltProcMap_visit_cdt_code_map_VisitCdtCodeMapId",
                table: "DefToAltProcMap");

            migrationBuilder.DropIndex(
                name: "IX_DefToAltProcMap_VisitCdtCodeMapId",
                table: "DefToAltProcMap");

            migrationBuilder.DropColumn(
                name: "VisitCdtCodeMapId",
                table: "DefToAltProcMap");

            migrationBuilder.AddColumn<int>(
                name: "DefToAltProcMapId",
                table: "visit_cdt_code_map",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_visit_cdt_code_map_DefToAltProcMapId",
                table: "visit_cdt_code_map",
                column: "DefToAltProcMapId");

            migrationBuilder.AddForeignKey(
                name: "FK_visit_cdt_code_map_DefToAltProcMap_DefToAltProcMapId",
                table: "visit_cdt_code_map",
                column: "DefToAltProcMapId",
                principalTable: "DefToAltProcMap",
                principalColumn: "DefToAltProcMapId");
        }
    }
}
