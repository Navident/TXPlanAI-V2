using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DentalTreatmentPlanner.Server.Migrations
{
    /// <inheritdoc />
    public partial class vistoprocmapandproctocdtmap : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "VisitToProcedureMaps",
                columns: table => new
                {
                    VisitToProcedureMapId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VisitId = table.Column<int>(type: "int", nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false),
                    ToothNumber = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Surface = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Arch = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProcedureTypeId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VisitToProcedureMaps", x => x.VisitToProcedureMapId);
                    table.ForeignKey(
                        name: "FK_VisitToProcedureMaps_procedure_type_ProcedureTypeId",
                        column: x => x.ProcedureTypeId,
                        principalTable: "procedure_type",
                        principalColumn: "procedure_type_id");
                    table.ForeignKey(
                        name: "FK_VisitToProcedureMaps_visit_VisitId",
                        column: x => x.VisitId,
                        principalTable: "visit",
                        principalColumn: "visit_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProcedureToCdtMap",
                columns: table => new
                {
                    ProcedureToCdtMapId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    VisitToProcedureMapId = table.Column<int>(type: "int", nullable: false),
                    UserDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CdtCodeId = table.Column<int>(type: "int", nullable: false),
                    Default = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProcedureToCdtMap", x => x.ProcedureToCdtMapId);
                    table.ForeignKey(
                        name: "FK_ProcedureToCdtMap_VisitToProcedureMaps_VisitToProcedureMapId",
                        column: x => x.VisitToProcedureMapId,
                        principalTable: "VisitToProcedureMaps",
                        principalColumn: "VisitToProcedureMapId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProcedureToCdtMap_cdt_code_CdtCodeId",
                        column: x => x.CdtCodeId,
                        principalTable: "cdt_code",
                        principalColumn: "cdt_code_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProcedureToCdtMap_CdtCodeId",
                table: "ProcedureToCdtMap",
                column: "CdtCodeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProcedureToCdtMap_VisitToProcedureMapId",
                table: "ProcedureToCdtMap",
                column: "VisitToProcedureMapId");

            migrationBuilder.CreateIndex(
                name: "IX_VisitToProcedureMaps_ProcedureTypeId",
                table: "VisitToProcedureMaps",
                column: "ProcedureTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_VisitToProcedureMaps_VisitId",
                table: "VisitToProcedureMaps",
                column: "VisitId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProcedureToCdtMap");

            migrationBuilder.DropTable(
                name: "VisitToProcedureMaps");
        }
    }
}
