using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DentalTreatmentPlanner.Server.Migrations
{
    /// <inheritdoc />
    public partial class CreateUcrFeeTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UcrFeeMaps_PayerFacilityMap_PayerFacilityMapId",
                table: "UcrFeeMaps");

            migrationBuilder.DropForeignKey(
                name: "FK_UcrFeeMaps_cdt_code_CdtCodeId",
                table: "UcrFeeMaps");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UcrFeeMaps",
                table: "UcrFeeMaps");

            migrationBuilder.RenameTable(
                name: "UcrFeeMaps",
                newName: "UcrFee");

            migrationBuilder.RenameIndex(
                name: "IX_UcrFeeMaps_PayerFacilityMapId",
                table: "UcrFee",
                newName: "IX_UcrFee_PayerFacilityMapId");

            migrationBuilder.RenameIndex(
                name: "IX_UcrFeeMaps_CdtCodeId",
                table: "UcrFee",
                newName: "IX_UcrFee_CdtCodeId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UcrFee",
                table: "UcrFee",
                column: "UcrFeeId");

            migrationBuilder.AddForeignKey(
                name: "FK_UcrFee_PayerFacilityMap_PayerFacilityMapId",
                table: "UcrFee",
                column: "PayerFacilityMapId",
                principalTable: "PayerFacilityMap",
                principalColumn: "PayerFacilityMapId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UcrFee_cdt_code_CdtCodeId",
                table: "UcrFee",
                column: "CdtCodeId",
                principalTable: "cdt_code",
                principalColumn: "cdt_code_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UcrFee_PayerFacilityMap_PayerFacilityMapId",
                table: "UcrFee");

            migrationBuilder.DropForeignKey(
                name: "FK_UcrFee_cdt_code_CdtCodeId",
                table: "UcrFee");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UcrFee",
                table: "UcrFee");

            migrationBuilder.RenameTable(
                name: "UcrFee",
                newName: "UcrFeeMaps");

            migrationBuilder.RenameIndex(
                name: "IX_UcrFee_PayerFacilityMapId",
                table: "UcrFeeMaps",
                newName: "IX_UcrFeeMaps_PayerFacilityMapId");

            migrationBuilder.RenameIndex(
                name: "IX_UcrFee_CdtCodeId",
                table: "UcrFeeMaps",
                newName: "IX_UcrFeeMaps_CdtCodeId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UcrFeeMaps",
                table: "UcrFeeMaps",
                column: "UcrFeeId");

            migrationBuilder.AddForeignKey(
                name: "FK_UcrFeeMaps_PayerFacilityMap_PayerFacilityMapId",
                table: "UcrFeeMaps",
                column: "PayerFacilityMapId",
                principalTable: "PayerFacilityMap",
                principalColumn: "PayerFacilityMapId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UcrFeeMaps_cdt_code_CdtCodeId",
                table: "UcrFeeMaps",
                column: "CdtCodeId",
                principalTable: "cdt_code",
                principalColumn: "cdt_code_id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
