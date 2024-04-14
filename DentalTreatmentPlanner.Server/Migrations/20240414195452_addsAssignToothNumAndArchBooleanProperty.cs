using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DentalTreatmentPlanner.Server.Migrations
{
    /// <inheritdoc />
    public partial class addsAssignToothNumAndArchBooleanProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AssignArch",
                table: "VisitToProcedureMaps",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "AssignToothNumber",
                table: "VisitToProcedureMaps",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AssignArch",
                table: "VisitToProcedureMaps");

            migrationBuilder.DropColumn(
                name: "AssignToothNumber",
                table: "VisitToProcedureMaps");
        }
    }
}
