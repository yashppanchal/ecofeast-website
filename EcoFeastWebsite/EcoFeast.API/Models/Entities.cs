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

// ─── SITE SETTINGS (for tagline, contact info etc.) ────────────
public class SiteSetting
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Key { get; set; } = string.Empty; // e.g. "tagline", "phone", "address"

    [Required, MaxLength(1000)]
    public string Value { get; set; } = string.Empty;
}
