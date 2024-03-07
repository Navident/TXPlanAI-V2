using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DentalTreatmentPlanner.Server.Migrations
{
    /// <inheritdoc />
    public partial class deletePhases : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_visit_cdt_code_map_TreatmentPhases_TreatmentPhaseId",
                table: "visit_cdt_code_map");

            migrationBuilder.DropTable(
                name: "TreatmentPhases");

            migrationBuilder.DropIndex(
                name: "IX_visit_cdt_code_map_TreatmentPhaseId",
                table: "visit_cdt_code_map");

            migrationBuilder.DropColumn(
                name: "TreatmentPhaseId",
                table: "visit_cdt_code_map");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TreatmentPhaseId",
                table: "visit_cdt_code_map",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "TreatmentPhases",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Label = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TreatmentPhases", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_visit_cdt_code_map_TreatmentPhaseId",
                table: "visit_cdt_code_map",
                column: "TreatmentPhaseId");

            migrationBuilder.AddForeignKey(
                name: "FK_visit_cdt_code_map_TreatmentPhases_TreatmentPhaseId",
                table: "visit_cdt_code_map",
                column: "TreatmentPhaseId",
                principalTable: "TreatmentPhases",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
