using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DentalTreatmentPlanner.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddFacilityToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FacilityId",
                table: "AspNetUsers",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_FacilityId",
                table: "AspNetUsers",
                column: "FacilityId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_facility_FacilityId",
                table: "AspNetUsers",
                column: "FacilityId",
                principalTable: "facility",
                principalColumn: "facility_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_facility_FacilityId",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_FacilityId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "FacilityId",
                table: "AspNetUsers");
        }
    }
}
