using EcoFeast.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EcoFeast.API.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        // Only seed if tables are empty
        if (await db.StatCounters.AnyAsync()) return;

        // ─── Stats ─────────────────────────────────────────
        db.StatCounters.AddRange(
            new StatCounter { Label = "Trades Completed", Value = 150, Suffix = "+", DisplayOrder = 1 },
            new StatCounter { Label = "Happy Buyers", Value = 45, Suffix = "+", DisplayOrder = 2 },
            new StatCounter { Label = "Countries Served", Value = 12, Suffix = "", DisplayOrder = 3 },
            new StatCounter { Label = "Products Exported", Value = 11, Suffix = "", DisplayOrder = 4 }
        );

        // ─── Products ──────────────────────────────────────
        db.Products.AddRange(
            new Product { Name = "Fresh Onions", HsCode = "07031019", Category = "Fresh Vegetables", Emoji = "🧅", DisplayOrder = 1 },
            new Product { Name = "Alphonso Mangoes", HsCode = "08045021", Category = "Fresh Fruits", Emoji = "🥭", DisplayOrder = 2 },
            new Product { Name = "Pomegranates", HsCode = "08109010", Category = "Fresh Fruits", Emoji = "🍎", DisplayOrder = 3 },
            new Product { Name = "Fresh Grapes", HsCode = "08061000", Category = "Fresh Fruits", Emoji = "🍇", DisplayOrder = 4 },
            new Product { Name = "Fresh Bananas", HsCode = "08039010", Category = "Fresh Fruits", Emoji = "🍌", DisplayOrder = 5 },
            new Product { Name = "Green Chilly", HsCode = "07096010", Category = "Fresh Vegetables", Emoji = "🌶️", DisplayOrder = 6 },
            new Product { Name = "Basmati Rice", HsCode = "10063020", Category = "Cereals", Emoji = "🍚", DisplayOrder = 7 },
            new Product { Name = "Chilly Powder", HsCode = "09042211", Category = "Spices", Emoji = "🫙", DisplayOrder = 8 },
            new Product { Name = "Ladoos", HsCode = "21069099", Category = "Processed Foods", Emoji = "🍬", DisplayOrder = 9 },
            new Product { Name = "Sweet Corn Frozen", HsCode = "07104000", Category = "Frozen", Emoji = "🌽", DisplayOrder = 10 },
            new Product { Name = "Mix Vegetables Frozen", HsCode = "07109000", Category = "Frozen", Emoji = "🥦", DisplayOrder = 11 }
        );

        // ─── Strengths ─────────────────────────────────────
        db.Strengths.AddRange(
            new Strength { Title = "Established Supplier", Description = "Proven track record in fresh onion exports with consistent domestic and international supply chain.", DisplayOrder = 1 },
            new Strength { Title = "Pan-India Sourcing", Description = "Strong procurement network across major agricultural belts — Maharashtra, Gujarat, Karnataka, and more.", DisplayOrder = 2 },
            new Strength { Title = "Quality & Safety", Description = "FSSAI licensed, APEDA registered, with lab testing and inspections per destination country standards.", DisplayOrder = 3 },
            new Strength { Title = "Logistics Excellence", Description = "End-to-end export documentation, FOB/CIF/CFR support, and a reliable freight partner network.", DisplayOrder = 4 },
            new Strength { Title = "Custom Packaging", Description = "Bulk packing in 10kg, 25kg, 50kg bags with custom labeling options for buyer specifications.", DisplayOrder = 5 },
            new Strength { Title = "Long-term Partners", Description = "We build relationships, not transactions. Flexible planning, repeat supply, and after-sales coordination.", DisplayOrder = 6 }
        );

        // ─── Site Settings ─────────────────────────────────
        db.SiteSettings.AddRange(
            new SiteSetting { Key = "tagline", Value = "Premium by Nature. Powerful by Supply." },
            new SiteSetting { Key = "phone", Value = "+91 96531 56090" },
            new SiteSetting { Key = "email", Value = "ecofeastnutrients@gmail.com" },
            new SiteSetting { Key = "address", Value = "B 504, Navbhagyashree, Mahatma Phule Road, Mulund(E), Mumbai - 81" },
            new SiteSetting { Key = "contactPerson", Value = "Kaustubh Chavan" },
            new SiteSetting { Key = "contactTitle", Value = "Director" },
            new SiteSetting { Key = "contactPerson2", Value = "Chaitanya Asarkar" },
            new SiteSetting { Key = "contactTitle2", Value = "Director" },
            new SiteSetting { Key = "phone2", Value = "+91 83692 95601" }
        );

        // ─── Default Admin ─────────────────────────────────
        db.AdminUsers.Add(new AdminUser
        {
            Username = "admin",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("EcoFeast@2025"),
            Email = "ecofeastnutrients@gmail.com"
        });

        await db.SaveChangesAsync();
    }
}
