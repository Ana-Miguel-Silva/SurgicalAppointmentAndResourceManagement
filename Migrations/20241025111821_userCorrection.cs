using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DDDNetCore.Migrations
{
    /// <inheritdoc />
    public partial class userCorrection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Patients_EmergencyContactEmail",
                table: "Patients");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_EmergencyContactEmail",
                table: "Patients",
                column: "EmergencyContactEmail");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Patients_EmergencyContactEmail",
                table: "Patients");

            migrationBuilder.CreateIndex(
                name: "IX_Patients_EmergencyContactEmail",
                table: "Patients",
                column: "EmergencyContactEmail",
                unique: true);
        }
    }
}
