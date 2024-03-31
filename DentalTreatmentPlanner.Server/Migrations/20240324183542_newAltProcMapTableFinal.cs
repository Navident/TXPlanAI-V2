using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DentalTreatmentPlanner.Server.Migrations
{
    /// <inheritdoc />
    public partial class newAltProcMapTableFinal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AlternativeProcedures_visit_cdt_code_map_VisitCdtCodeMapId",
                table: "AlternativeProcedures");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AlternativeProcedures",
                table: "AlternativeProcedures");

            migrationBuilder.DropIndex(
                name: "IX_AlternativeProcedures_VisitCdtCodeMapId",
                table: "AlternativeProcedures");

            migrationBuilder.DropColumn(
                name: "AlternativeProcedureId",
                table: "AlternativeProcedures");

            // Renaming the column first to avoid confusion with the add/drop operations
            migrationBuilder.RenameColumn(
                name: "VisitCdtCodeMapId",
                table: "AlternativeProcedures",
                newName: "DefToAltProcMapId_Temp");

            migrationBuilder.AddColumn<int>(
                name: "DefToAltProcMapId",
                table: "visit_cdt_code_map",
                type: "int",
                nullable: true);

            // Drop the temporarily renamed column to recreate it with the identity property
            migrationBuilder.DropColumn(
                name: "DefToAltProcMapId_Temp",
                table: "AlternativeProcedures");

            migrationBuilder.AddColumn<int>(
                name: "DefToAltProcMapId",
                table: "AlternativeProcedures",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_AlternativeProcedures",
                table: "AlternativeProcedures",
                column: "DefToAltProcMapId");

            migrationBuilder.CreateIndex(
                name: "IX_visit_cdt_code_map_DefToAltProcMapId",
                table: "visit_cdt_code_map",
                column: "DefToAltProcMapId");

            migrationBuilder.AddForeignKey(
                name: "FK_visit_cdt_code_map_AlternativeProcedures_DefToAltProcMapId",
                table: "visit_cdt_code_map",
                column: "DefToAltProcMapId",
                principalTable: "AlternativeProcedures",
                principalColumn: "DefToAltProcMapId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_visit_cdt_code_map_AlternativeProcedures_DefToAltProcMapId",
                table: "visit_cdt_code_map");

            migrationBuilder.DropIndex(
                name: "IX_visit_cdt_code_map_DefToAltProcMapId",
                table: "visit_cdt_code_map");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AlternativeProcedures",
                table: "AlternativeProcedures");

            migrationBuilder.DropColumn(
                name: "DefToAltProcMapId",
                table: "visit_cdt_code_map");

            migrationBuilder.RenameColumn(
                name: "DefToAltProcMapId",
                table: "AlternativeProcedures",
                newName: "VisitCdtCodeMapId");

            migrationBuilder.AlterColumn<int>(
                name: "VisitCdtCodeMapId",
                table: "AlternativeProcedures",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .OldAnnotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<int>(
                name: "AlternativeProcedureId",
                table: "AlternativeProcedures",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AlternativeProcedures",
                table: "AlternativeProcedures",
                column: "AlternativeProcedureId");

            migrationBuilder.CreateIndex(
                name: "IX_AlternativeProcedures_VisitCdtCodeMapId",
                table: "AlternativeProcedures",
                column: "VisitCdtCodeMapId");

            migrationBuilder.AddForeignKey(
                name: "FK_AlternativeProcedures_visit_cdt_code_map_VisitCdtCodeMapId",
                table: "AlternativeProcedures",
                column: "VisitCdtCodeMapId",
                principalTable: "visit_cdt_code_map",
                principalColumn: "visit_cdt_code_map_id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
