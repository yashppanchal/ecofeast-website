using EcoFeast.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EcoFeast.API.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        // ─── Categories (seed independently — safe to add to existing dbs) ─
        if (!await db.Categories.AnyAsync())
        {
            db.Categories.AddRange(
                new Category { Name = "Fresh Vegetables", DisplayOrder = 1 },
                new Category { Name = "Fresh Fruits",     DisplayOrder = 2 },
                new Category { Name = "Cereals",          DisplayOrder = 3 },
                new Category { Name = "Spices",           DisplayOrder = 4 },
                new Category { Name = "Processed Foods",  DisplayOrder = 5 },
                new Category { Name = "Frozen",           DisplayOrder = 6 }
            );
            await db.SaveChangesAsync();
        }

        // ─── Map Countries (seed independently — safe to add to existing dbs) ─
        if (!await db.MapCountries.AnyAsync())
        {
            db.MapCountries.AddRange(
                new MapCountry { Name = "India",         Latitude = 22,  Longitude = 78,  IsHome = true,  DisplayOrder = 1 },
                new MapCountry { Name = "Africa",        Latitude = 5,   Longitude = 20,  DisplayOrder = 2 },
                new MapCountry { Name = "Middle East",   Latitude = 28,  Longitude = 48,  DisplayOrder = 3 },
                new MapCountry { Name = "Europe",        Latitude = 50,  Longitude = 15,  DisplayOrder = 4 },
                new MapCountry { Name = "USA",           Latitude = 40,  Longitude = -95, DisplayOrder = 5 },
                new MapCountry { Name = "South America", Latitude = -15, Longitude = -58, DisplayOrder = 6 },
                new MapCountry { Name = "Asia",          Latitude = 35,  Longitude = 105, DisplayOrder = 7 }
            );
            await db.SaveChangesAsync();
        }

        // ─── Testimonials (seed independently — safe to add to existing dbs) ─
        if (!await db.Testimonials.AnyAsync())
        {
            db.Testimonials.AddRange(
                new Testimonial { Name = "Ahmed Al-Rashid",  Title = "Procurement Head", Company = "Gulf Fresh Trading LLC",  Country = "UAE",    Quote = "EcoFeast has been our trusted partner for Alphonso mangoes for three seasons. Their quality consistency and documentation speed are unmatched in the Indian export market.", Rating = 5, DisplayOrder = 1 },
                new Testimonial { Name = "Maria Gonzalez",   Title = "Import Director",  Company = "EuroAgro Imports SA",     Country = "Spain",  Quote = "From first inquiry to FOB delivery, the team handles every detail with professionalism. Our pomegranate shipments arrive exactly as specified — every single time.",           Rating = 5, DisplayOrder = 2 },
                new Testimonial { Name = "Kwame Osei",       Title = "CEO",               Company = "West Africa Commodities", Country = "Ghana",  Quote = "Reliable onion supply at competitive pricing. Kaustubh and his team genuinely understand the African market and adapt their packaging to our climate requirements.",          Rating = 5, DisplayOrder = 3 },
                new Testimonial { Name = "Hiroshi Tanaka",   Title = "Buyer",             Company = "Osaka Fresh Co.",         Country = "Japan",  Quote = "Exceptional attention to phytosanitary standards. EcoFeast is the only Indian supplier we trust for Basmati rice entering the Japanese market.",                              Rating = 5, DisplayOrder = 4 },
                new Testimonial { Name = "Sarah Mitchell",   Title = "Sourcing Manager",  Company = "Atlantic Foods USA",      Country = "USA",    Quote = "Transparent pricing, honest communication, and flawless logistics. They turned a complicated cross-border shipment into a routine transaction.",                              Rating = 5, DisplayOrder = 5 },
                new Testimonial { Name = "Dmitri Volkov",    Title = "Trade Partner",     Company = "EasternLine Group",       Country = "Russia", Quote = "The attention to export documentation and compliance saved us weeks of customs delays. A true professional export house.",                                                Rating = 5, DisplayOrder = 6 }
            );
            await db.SaveChangesAsync();
        }

        // Only seed remaining tables if completely fresh
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
            new Product { Name = "Fresh Onions", HsCode = "07031019", Category = "Fresh Vegetables", Emoji = "", ImageUrl = "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&q=80", Description = "Export grade red & white onions", Price = 280, Currency = "USD", DisplayOrder = 1 },
            new Product { Name = "Alphonso Mangoes", HsCode = "08045021", Category = "Fresh Fruits", Emoji = "", ImageUrl = "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&q=80", Description = "Premium Ratnagiri Alphonso", Price = 1200, Currency = "USD", DisplayOrder = 2 },
            new Product { Name = "Pomegranates", HsCode = "08109010", Category = "Fresh Fruits", Emoji = "", ImageUrl = "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80", Description = "Premium Bhagwa variety", Price = 1500, Currency = "USD", DisplayOrder = 3 },
            new Product { Name = "Fresh Grapes", HsCode = "08061000", Category = "Fresh Fruits", Emoji = "", ImageUrl = "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&q=80", Description = "Thompson seedless, Sharad seedless", Price = 600, Currency = "USD", DisplayOrder = 4 },
            new Product { Name = "Fresh Bananas", HsCode = "08039010", Category = "Fresh Fruits", Emoji = "", ImageUrl = "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=600&q=80", Description = "Cavendish G9 variety", Price = 350, Currency = "USD", DisplayOrder = 5 },
            new Product { Name = "Green Chilly", HsCode = "07096010", Category = "Fresh Vegetables", Emoji = "", ImageUrl = "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=600&q=80", Description = "Fresh green chillies", Price = 400, Currency = "USD", DisplayOrder = 6 },
            new Product { Name = "Basmati Rice", HsCode = "10063020", Category = "Cereals", Emoji = "", ImageUrl = "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80", Description = "1121 & Pusa varieties", Price = 950, Currency = "USD", DisplayOrder = 7 },
            new Product { Name = "Chilly Powder", HsCode = "09042211", Category = "Spices", Emoji = "", ImageUrl = "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&q=80", Description = "Guntur, Kashmiri, Byadgi", Price = 850, Currency = "USD", DisplayOrder = 8 },
            new Product { Name = "Ladoos", HsCode = "21069099", Category = "Processed Foods", Emoji = "", ImageUrl = "https://images.unsplash.com/photo-1666190403330-01e5e45b4e57?w=600&q=80", Description = "Traditional Indian sweets", Price = 500, Currency = "USD", DisplayOrder = 9 },
            new Product { Name = "Sweet Corn Frozen", HsCode = "07104000", Category = "Frozen", Emoji = "", ImageUrl = "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&q=80", Description = "IQF frozen, bulk packing", Price = 450, Currency = "USD", DisplayOrder = 10 },
            new Product { Name = "Mix Vegetables Frozen", HsCode = "07109000", Category = "Frozen", Emoji = "", ImageUrl = "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80", Description = "IQF mixed vegetables", Price = 480, Currency = "USD", DisplayOrder = 11 }
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
