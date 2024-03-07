using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DentalTreatmentPlanner.Server.Migrations
{
    /// <inheritdoc />
    public partial class DiscountFee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UcrFeeMaps",
                columns: table => new
                {
                    UcrFeeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PayerFacilityMapId = table.Column<int>(type: "int", nullable: false),
                    CdtCodeId = table.Column<int>(type: "int", nullable: false),
                    UcrDollarAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DiscountFeeDollarAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UcrFeeMaps", x => x.UcrFeeId);
                    table.ForeignKey(
                        name: "FK_UcrFeeMaps_PayerFacilityMap_PayerFacilityMapId",
                        column: x => x.PayerFacilityMapId,
                        principalTable: "PayerFacilityMap",
                        principalColumn: "PayerFacilityMapId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UcrFeeMaps_cdt_code_CdtCodeId",
                        column: x => x.CdtCodeId,
                        principalTable: "cdt_code",
                        principalColumn: "cdt_code_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UcrFeeMaps_CdtCodeId",
                table: "UcrFeeMaps",
                column: "CdtCodeId");

            migrationBuilder.CreateIndex(
                name: "IX_UcrFeeMaps_PayerFacilityMapId",
                table: "UcrFeeMaps",
                column: "PayerFacilityMapId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UcrFeeMaps");
        }
    }
}
