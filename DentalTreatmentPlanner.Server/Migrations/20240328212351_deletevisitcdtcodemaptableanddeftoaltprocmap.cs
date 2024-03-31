using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DentalTreatmentPlanner.Server.Migrations
{
    /// <inheritdoc />
    public partial class deletevisitcdtcodemaptableanddeftoaltprocmap : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DefToAltProcMap_visit_cdt_code_map_VisitCdtCodeMapId",
                table: "DefToAltProcMap");

            migrationBuilder.DropTable(
                name: "visit_cdt_code_map");

            migrationBuilder.DropTable(
                name: "DefToAltProcMap");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DefToAltProcMap",
                columns: table => new
                {
                    DefToAltProcMapId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AlternativeProcedureCdtCodeId = table.Column<int>(type: "int", nullable: true),
                    DefaultCdtCodeId = table.Column<int>(type: "int", nullable: true),
                    VisitCdtCodeMapId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserDescription = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DefToAltProcMap", x => x.DefToAltProcMapId);
                    table.ForeignKey(
                        name: "FK_DefToAltProcMap_cdt_code_AlternativeProcedureCdtCodeId",
                        column: x => x.AlternativeProcedureCdtCodeId,
                        principalTable: "cdt_code",
                        principalColumn: "cdt_code_id");
                    table.ForeignKey(
                        name: "FK_DefToAltProcMap_cdt_code_DefaultCdtCodeId",
                        column: x => x.DefaultCdtCodeId,
                        principalTable: "cdt_code",
                        principalColumn: "cdt_code_id");
                });

            migrationBuilder.CreateTable(
                name: "visit_cdt_code_map",
                columns: table => new
                {
                    visit_cdt_code_map_id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    cdt_code_id = table.Column<int>(type: "int", nullable: false),
                    ChosenAltCdtCodeCdtCodeId = table.Column<int>(type: "int", nullable: true),
                    ChosenDefToAltProcMapId = table.Column<int>(type: "int", nullable: true),
                    procedure_type_id = table.Column<int>(type: "int", nullable: true),
                    visit_id = table.Column<int>(type: "int", nullable: false),
                    Arch = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    created_at = table.Column<DateTime>(type: "datetime2", nullable: false),
                    modified_at = table.Column<DateTime>(type: "datetime2", nullable: true),
                    order = table.Column<int>(type: "int", nullable: false),
                    Surface = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    tooth_number = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_visit_cdt_code_map", x => x.visit_cdt_code_map_id);
                    table.ForeignKey(
                        name: "FK_VisitCdtCodeMap_CdtCode",
                        column: x => x.cdt_code_id,
                        principalTable: "cdt_code",
                        principalColumn: "cdt_code_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_VisitCdtCodeMap_ChosenDefToAltProcMap",
                        column: x => x.ChosenDefToAltProcMapId,
                        principalTable: "DefToAltProcMap",
                        principalColumn: "DefToAltProcMapId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_visit_cdt_code_map_cdt_code_ChosenAltCdtCodeCdtCodeId",
                        column: x => x.ChosenAltCdtCodeCdtCodeId,
                        principalTable: "cdt_code",
                        principalColumn: "cdt_code_id");
                    table.ForeignKey(
                        name: "FK_visit_cdt_code_map_procedure_type_procedure_type_id",
                        column: x => x.procedure_type_id,
                        principalTable: "procedure_type",
                        principalColumn: "procedure_type_id");
                    table.ForeignKey(
                        name: "FK_visit_cdt_code_map_visit_visit_id",
                        column: x => x.visit_id,
                        principalTable: "visit",
                        principalColumn: "visit_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DefToAltProcMap_AlternativeProcedureCdtCodeId",
                table: "DefToAltProcMap",
                column: "AlternativeProcedureCdtCodeId");

            migrationBuilder.CreateIndex(
                name: "IX_DefToAltProcMap_DefaultCdtCodeId",
                table: "DefToAltProcMap",
                column: "DefaultCdtCodeId");

            migrationBuilder.CreateIndex(
                name: "IX_DefToAltProcMap_VisitCdtCodeMapId",
                table: "DefToAltProcMap",
                column: "VisitCdtCodeMapId");

            migrationBuilder.CreateIndex(
                name: "IX_visit_cdt_code_map_cdt_code_id",
                table: "visit_cdt_code_map",
                column: "cdt_code_id");

            migrationBuilder.CreateIndex(
                name: "IX_visit_cdt_code_map_ChosenAltCdtCodeCdtCodeId",
                table: "visit_cdt_code_map",
                column: "ChosenAltCdtCodeCdtCodeId");

            migrationBuilder.CreateIndex(
                name: "IX_visit_cdt_code_map_ChosenDefToAltProcMapId",
                table: "visit_cdt_code_map",
                column: "ChosenDefToAltProcMapId");

            migrationBuilder.CreateIndex(
                name: "IX_visit_cdt_code_map_procedure_type_id",
                table: "visit_cdt_code_map",
                column: "procedure_type_id");

            migrationBuilder.CreateIndex(
                name: "IX_visit_cdt_code_map_visit_id",
                table: "visit_cdt_code_map",
                column: "visit_id");

            migrationBuilder.AddForeignKey(
                name: "FK_DefToAltProcMap_visit_cdt_code_map_VisitCdtCodeMapId",
                table: "DefToAltProcMap",
                column: "VisitCdtCodeMapId",
                principalTable: "visit_cdt_code_map",
                principalColumn: "visit_cdt_code_map_id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
