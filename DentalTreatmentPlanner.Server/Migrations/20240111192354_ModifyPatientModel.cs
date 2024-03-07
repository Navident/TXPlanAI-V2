using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DentalTreatmentPlanner.Server.Migrations
{
    /// <inheritdoc />
    public partial class ModifyPatientModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Patient",
                newName: "LastName");

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "Patient",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "Patient");

            migrationBuilder.RenameColumn(
                name: "LastName",
                table: "Patient",
                newName: "Name");
        }
    }
}
