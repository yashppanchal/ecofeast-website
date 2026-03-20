using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EcoFeast.API.Migrations
{
    /// <inheritdoc />
    public partial class AddProductPriceUnit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PriceUnit",
                table: "Products",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PriceUnit",
                table: "Products");
        }
    }
}
