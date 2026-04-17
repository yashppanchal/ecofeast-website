using System.ComponentModel.DataAnnotations;

namespace EcoFeast.API.Models;

// ─── STAT COUNTER (Trades, Buyers, Countries, Products) ────────
public class StatCounter
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Label { get; set; } = string.Empty; // e.g. "Trades Completed"

    public int Value { get; set; } // e.g. 150

    [MaxLength(10)]
    public string Suffix { get; set; } = string.Empty; // e.g. "+"

    public int DisplayOrder { get; set; }

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

// ─── PRODUCT ───────────────────────────────────────────────────
public class Product
{
    public int Id { get; set; }

    [Required, MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(20)]
    public string HsCode { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string Category { get; set; } = string.Empty; // Fresh Fruits, Spices, etc.

    [MaxLength(10)]
    public string Emoji { get; set; } = string.Empty;

    [MaxLength(500)]
    public string ImageUrl { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; } = 0;

    [MaxLength(10)]
    public string Currency { get; set; } = "USD"; // USD, EUR, GBP, INR, AED

    [MaxLength(20)]
    public string PriceUnit { get; set; } = "/MT"; // e.g. "/MT", "/KG", "/Piece", "" to hide

    public bool IsActive { get; set; } = true;

    public int DisplayOrder { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

// ─── STRENGTH / USP ────────────────────────────────────────────
public class Strength
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    public int DisplayOrder { get; set; }

    public bool IsActive { get; set; } = true;
}

// ─── CONTACT INQUIRY ───────────────────────────────────────────
public class ContactInquiry
{
    public int Id { get; set; }

    [Required, MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(200)]
    public string Company { get; set; } = string.Empty;

    [Required, MaxLength(2000)]
    public string Message { get; set; } = string.Empty;

    public bool IsRead { get; set; } = false;

    public bool IsArchived { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

// ─── ADMIN USER ────────────────────────────────────────────────
public class AdminUser
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

// ─── GALLERY IMAGE ────────────────────────────────────────────
public class GalleryImage
{
    public int Id { get; set; }

    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(500)]
    public string ImageUrl { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string Category { get; set; } = string.Empty; // Reuses product categories

    public bool IsActive { get; set; } = true;

    public int DisplayOrder { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

// ─── MAP COUNTRY (marker on the global reach map) ─────────────
public class MapCountry
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public double Latitude { get; set; }

    public double Longitude { get; set; }

    public bool IsHome { get; set; } = false;

    public bool IsActive { get; set; } = true;

    public int DisplayOrder { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

// ─── CATEGORY (product category, dynamic via admin) ───────────
public class Category
{
    public int Id { get; set; }

    [Required, MaxLength(50)]
    public string Name { get; set; } = string.Empty;

    public int DisplayOrder { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

// ─── TESTIMONIAL (buyer quote) ────────────────────────────────
public class Testimonial
{
    public int Id { get; set; }

    [Required, MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(150)]
    public string Title { get; set; } = string.Empty; // e.g. "Procurement Head"

    [MaxLength(200)]
    public string Company { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Country { get; set; } = string.Empty;

    [Required, MaxLength(1500)]
    public string Quote { get; set; } = string.Empty;

    public int Rating { get; set; } = 5; // 1-5

    public bool IsActive { get; set; } = true;

    public int DisplayOrder { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

// ─── SITE SETTINGS (for tagline, contact info etc.) ────────────
public class SiteSetting
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Key { get; set; } = string.Empty; // e.g. "tagline", "phone", "address"

    [Required, MaxLength(1000)]
    public string Value { get; set; } = string.Empty;
}
