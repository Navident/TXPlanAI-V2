using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DentalTreatmentPlanner.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddPatientAndUpdateTreatmentPlan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {


            migrationBuilder.AddColumn<int>(
                name: "PatientId",
                table: "treatment_plan",
                type: "int",
                nullable: true);



            migrationBuilder.CreateTable(
                name: "Patient",
                columns: table => new
                {
                    PatientId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FacilityId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patient", x => x.PatientId);
                    table.ForeignKey(
                        name: "FK_Patient_facility_FacilityId",
                        column: x => x.FacilityId,
                        principalTable: "facility",
                        principalColumn: "facility_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_treatment_plan_PatientId",
                table: "treatment_plan",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_Patient_FacilityId",
                table: "Patient",
                column: "FacilityId");

            migrationBuilder.AddForeignKey(
                name: "FK_treatment_plan_Patient_PatientId",
                table: "treatment_plan",
                column: "PatientId",
                principalTable: "Patient",
                principalColumn: "PatientId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_treatment_plan_Patient_PatientId",
                table: "treatment_plan");

            migrationBuilder.DropTable(
                name: "Patient");

            migrationBuilder.DropIndex(
                name: "IX_treatment_plan_PatientId",
                table: "treatment_plan");

            migrationBuilder.DropColumn(
                name: "PatientId",
                table: "treatment_plan");

        }
    }
}
