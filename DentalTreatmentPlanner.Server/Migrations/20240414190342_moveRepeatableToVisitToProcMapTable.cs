using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DentalTreatmentPlanner.Server.Migrations
{
    /// <inheritdoc />
    public partial class moveRepeatableToVisitToProcMapTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Repeatable",
                table: "ProcedureToCdtMap");

            migrationBuilder.AddColumn<bool>(
                name: "Repeatable",
                table: "VisitToProcedureMaps",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Repeatable",
                table: "VisitToProcedureMaps");

            migrationBuilder.AddColumn<bool>(
                name: "Repeatable",
                table: "ProcedureToCdtMap",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
