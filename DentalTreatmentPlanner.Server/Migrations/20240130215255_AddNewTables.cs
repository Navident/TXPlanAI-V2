using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DentalTreatmentPlanner.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddNewTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PayerId",
                table: "treatment_plan",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PayerId",
                table: "Patient",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Payer",
                columns: table => new
                {
                    PayerId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PayerName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payer", x => x.PayerId);
                });

            migrationBuilder.CreateTable(
                name: "PayerFacilityMap",
                columns: table => new
                {
                    PayerFacilityMapId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PayerId = table.Column<int>(type: "int", nullable: false),
                    FacilityId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PayerFacilityMap", x => x.PayerFacilityMapId);
                    table.ForeignKey(
                        name: "FK_PayerFacilityMap_Payer_PayerId",
                        column: x => x.PayerId,
                        principalTable: "Payer",
                        principalColumn: "PayerId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PayerFacilityMap_facility_FacilityId",
                        column: x => x.FacilityId,
                        principalTable: "facility",
                        principalColumn: "facility_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_treatment_plan_PayerId",
                table: "treatment_plan",
                column: "PayerId");

            migrationBuilder.CreateIndex(
                name: "IX_Patient_PayerId",
                table: "Patient",
                column: "PayerId");

            migrationBuilder.CreateIndex(
                name: "IX_PayerFacilityMap_FacilityId",
                table: "PayerFacilityMap",
                column: "FacilityId");

            migrationBuilder.CreateIndex(
                name: "IX_PayerFacilityMap_PayerId",
                table: "PayerFacilityMap",
                column: "PayerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Patient_Payer_PayerId",
                table: "Patient",
                column: "PayerId",
                principalTable: "Payer",
                principalColumn: "PayerId");

            migrationBuilder.AddForeignKey(
                name: "FK_treatment_plan_Payer_PayerId",
                table: "treatment_plan",
                column: "PayerId",
                principalTable: "Payer",
                principalColumn: "PayerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Patient_Payer_PayerId",
                table: "Patient");

            migrationBuilder.DropForeignKey(
                name: "FK_treatment_plan_Payer_PayerId",
                table: "treatment_plan");

            migrationBuilder.DropTable(
                name: "PayerFacilityMap");

            migrationBuilder.DropTable(
                name: "Payer");

            migrationBuilder.DropIndex(
                name: "IX_treatment_plan_PayerId",
                table: "treatment_plan");

            migrationBuilder.DropIndex(
                name: "IX_Patient_PayerId",
                table: "Patient");

            migrationBuilder.DropColumn(
                name: "PayerId",
                table: "treatment_plan");

            migrationBuilder.DropColumn(
                name: "PayerId",
                table: "Patient");
        }
    }
}
