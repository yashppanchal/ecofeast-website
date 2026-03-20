using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EcoFeast.API.Migrations
{
    /// <inheritdoc />
    public partial class SeedProductImagesAndPrices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Update existing products with images, descriptions, and prices
            migrationBuilder.Sql(@"
                UPDATE ""Products"" SET
                    ""ImageUrl"" = 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&q=80',
                    ""Description"" = 'Export grade red & white onions',
                    ""Price"" = 280, ""Currency"" = 'USD'
                WHERE ""Name"" = 'Fresh Onions' AND (""ImageUrl"" IS NULL OR ""ImageUrl"" = '');

                UPDATE ""Products"" SET
                    ""ImageUrl"" = 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&q=80',
                    ""Description"" = 'Premium Ratnagiri Alphonso',
                    ""Price"" = 1200, ""Currency"" = 'USD'
                WHERE ""Name"" = 'Alphonso Mangoes' AND (""ImageUrl"" IS NULL OR ""ImageUrl"" = '');

                UPDATE ""Products"" SET
                    ""ImageUrl"" = 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80',
                    ""Description"" = 'Premium Bhagwa variety',
                    ""Price"" = 1500, ""Currency"" = 'USD'
                WHERE ""Name"" = 'Pomegranates' AND (""ImageUrl"" IS NULL OR ""ImageUrl"" = '');

                UPDATE ""Products"" SET
                    ""ImageUrl"" = 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&q=80',
                    ""Description"" = 'Thompson seedless, Sharad seedless',
                    ""Price"" = 600, ""Currency"" = 'USD'
                WHERE ""Name"" = 'Fresh Grapes' AND (""ImageUrl"" IS NULL OR ""ImageUrl"" = '');

                UPDATE ""Products"" SET
                    ""ImageUrl"" = 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=600&q=80',
                    ""Description"" = 'Cavendish G9 variety',
                    ""Price"" = 350, ""Currency"" = 'USD'
                WHERE ""Name"" = 'Fresh Bananas' AND (""ImageUrl"" IS NULL OR ""ImageUrl"" = '');

                UPDATE ""Products"" SET
                    ""ImageUrl"" = 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=600&q=80',
                    ""Description"" = 'Fresh green chillies',
                    ""Price"" = 400, ""Currency"" = 'USD'
                WHERE ""Name"" = 'Green Chilly' AND (""ImageUrl"" IS NULL OR ""ImageUrl"" = '');

                UPDATE ""Products"" SET
                    ""ImageUrl"" = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80',
                    ""Description"" = '1121 & Pusa varieties',
                    ""Price"" = 950, ""Currency"" = 'USD'
                WHERE ""Name"" = 'Basmati Rice' AND (""ImageUrl"" IS NULL OR ""ImageUrl"" = '');

                UPDATE ""Products"" SET
                    ""ImageUrl"" = 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&q=80',
                    ""Description"" = 'Guntur, Kashmiri, Byadgi',
                    ""Price"" = 850, ""Currency"" = 'USD'
                WHERE ""Name"" = 'Chilly Powder' AND (""ImageUrl"" IS NULL OR ""ImageUrl"" = '');

                UPDATE ""Products"" SET
                    ""ImageUrl"" = 'https://images.unsplash.com/photo-1666190403330-01e5e45b4e57?w=600&q=80',
                    ""Description"" = 'Traditional Indian sweets',
                    ""Price"" = 500, ""Currency"" = 'USD'
                WHERE ""Name"" = 'Ladoos' AND (""ImageUrl"" IS NULL OR ""ImageUrl"" = '');

                UPDATE ""Products"" SET
                    ""ImageUrl"" = 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&q=80',
                    ""Description"" = 'IQF frozen, bulk packing',
                    ""Price"" = 450, ""Currency"" = 'USD'
                WHERE ""Name"" = 'Sweet Corn Frozen' AND (""ImageUrl"" IS NULL OR ""ImageUrl"" = '');

                UPDATE ""Products"" SET
                    ""ImageUrl"" = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80',
                    ""Description"" = 'IQF mixed vegetables',
                    ""Price"" = 480, ""Currency"" = 'USD'
                WHERE ""Name"" = 'Mix Vegetables Frozen' AND (""ImageUrl"" IS NULL OR ""ImageUrl"" = '');
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                UPDATE ""Products"" SET ""ImageUrl"" = '', ""Description"" = '', ""Price"" = 0, ""Currency"" = 'USD';
            ");
        }
    }
}
