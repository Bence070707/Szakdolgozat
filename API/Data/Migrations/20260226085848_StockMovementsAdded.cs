using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class StockMovementsAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StockMovementItems");

            migrationBuilder.RenameColumn(
                name: "IsDenied",
                table: "StockMovements",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "IsAccepted",
                table: "StockMovements",
                newName: "QuantityBefore");

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "StockMovements",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AddColumn<DateTime>(
                name: "DecidedAt",
                table: "StockMovements",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PriceAfter",
                table: "StockMovements",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PriceBefore",
                table: "StockMovements",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ProductId",
                table: "StockMovements",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "QuantityAfter",
                table: "StockMovements",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_StockMovements_CreatedBy",
                table: "StockMovements",
                column: "CreatedBy");

            migrationBuilder.AddForeignKey(
                name: "FK_StockMovements_AspNetUsers_CreatedBy",
                table: "StockMovements",
                column: "CreatedBy",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StockMovements_AspNetUsers_CreatedBy",
                table: "StockMovements");

            migrationBuilder.DropIndex(
                name: "IX_StockMovements_CreatedBy",
                table: "StockMovements");

            migrationBuilder.DropColumn(
                name: "DecidedAt",
                table: "StockMovements");

            migrationBuilder.DropColumn(
                name: "PriceAfter",
                table: "StockMovements");

            migrationBuilder.DropColumn(
                name: "PriceBefore",
                table: "StockMovements");

            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "StockMovements");

            migrationBuilder.DropColumn(
                name: "QuantityAfter",
                table: "StockMovements");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "StockMovements",
                newName: "IsDenied");

            migrationBuilder.RenameColumn(
                name: "QuantityBefore",
                table: "StockMovements",
                newName: "IsAccepted");

            migrationBuilder.AlterColumn<string>(
                name: "CreatedBy",
                table: "StockMovements",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "StockMovementItems",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    StockMovementId = table.Column<string>(type: "TEXT", nullable: false),
                    PriceAfter = table.Column<int>(type: "INTEGER", nullable: false),
                    PriceBefore = table.Column<int>(type: "INTEGER", nullable: false),
                    ProductId = table.Column<int>(type: "INTEGER", nullable: false),
                    QuantityAfter = table.Column<int>(type: "INTEGER", nullable: false),
                    QuantityBefore = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockMovementItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StockMovementItems_StockMovements_StockMovementId",
                        column: x => x.StockMovementId,
                        principalTable: "StockMovements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StockMovementItems_StockMovementId",
                table: "StockMovementItems",
                column: "StockMovementId");
        }
    }
}
