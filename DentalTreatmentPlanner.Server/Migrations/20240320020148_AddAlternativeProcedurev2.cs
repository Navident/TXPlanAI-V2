using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DentalTreatmentPlanner.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddAlternativeProcedurev2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AlternativeProcedures",
                columns: table => new
                {
                    AlternativeProcedureId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VisitCdtCodeMapId = table.Column<int>(type: "int", nullable: false),
                    CdtCodeId = table.Column<int>(type: "int", nullable: false),
                    UserDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlternativeProcedures", x => x.AlternativeProcedureId);
                    table.ForeignKey(
                        name: "FK_AlternativeProcedures_cdt_code_CdtCodeId",
                        column: x => x.CdtCodeId,
                        principalTable: "cdt_code",
                        principalColumn: "cdt_code_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AlternativeProcedures_visit_cdt_code_map_VisitCdtCodeMapId",
                        column: x => x.VisitCdtCodeMapId,
                        principalTable: "visit_cdt_code_map",
                        principalColumn: "visit_cdt_code_map_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AlternativeProcedures_CdtCodeId",
                table: "AlternativeProcedures",
                column: "CdtCodeId");

            migrationBuilder.CreateIndex(
                name: "IX_AlternativeProcedures_VisitCdtCodeMapId",
                table: "AlternativeProcedures",
                column: "VisitCdtCodeMapId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AlternativeProcedures");
        }
    }
}
