using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DentalTreatmentPlanner.Server.Migrations
{
    /// <inheritdoc />
    public partial class cascadingDeletionTest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK__visit__treatment__0A9D95DB",
                table: "visit");

            migrationBuilder.AddForeignKey(
                name: "FK__visit__treatment__0A9D95DB",
                table: "visit",
                column: "treatment_plan_id",
                principalTable: "treatment_plan",
                principalColumn: "treatment_plan_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.DropForeignKey(
                name: "FK__visit_cdt__visit__04E4BC85",
                table: "visit_cdt_code_map");

            migrationBuilder.AddForeignKey(
                name: "FK__visit_cdt__visit__04E4BC85",
                table: "visit_cdt_code_map",
                column: "visit_id",
                principalTable: "visit",
                principalColumn: "visit_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
