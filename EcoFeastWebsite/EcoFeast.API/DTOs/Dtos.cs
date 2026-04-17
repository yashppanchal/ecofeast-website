using System.ComponentModel.DataAnnotations;

namespace EcoFeast.API.DTOs;

// ─── STAT COUNTER ──────────────────────────────────────────────
public record StatCounterDto(int Id, string Label, int Value, string Suffix, int DisplayOrder);

public record UpdateStatDto(
    [Required, MaxLength(100)] string Label,
    [Range(0, int.MaxValue)] int Value,
    [MaxLength(10)] string Suffix,
    int DisplayOrder
);

// ─── PRODUCT ───────────────────────────────────────────────────
public record ProductDto(int Id, string Name, string HsCode, string Category, string Emoji,
    string ImageUrl, string Description, decimal Price, string Currency, string PriceUnit, bool IsActive, int DisplayOrder);

public record CreateProductDto(
    [Required, MaxLength(150)] string Name,
    [Required, MaxLength(20)] string HsCode,
    [Required, MaxLength(50)] string Category,
    [MaxLength(10)] string Emoji,
    [MaxLength(500)] string ImageUrl,
    [MaxLength(500)] string Description,
    decimal Price,
    [MaxLength(10)] string Currency,
    [MaxLength(20)] string PriceUnit,
    int DisplayOrder
);

public record UpdateProductDto(
    [Required, MaxLength(150)] string Name,
    [Required, MaxLength(20)] string HsCode,
    [Required, MaxLength(50)] string Category,
    [MaxLength(10)] string Emoji,
    [MaxLength(500)] string ImageUrl,
    [MaxLength(500)] string Description,
    decimal Price,
    [MaxLength(10)] string Currency,
    [MaxLength(20)] string PriceUnit,
    bool IsActive,
    int DisplayOrder
);

// ─── STRENGTH ──────────────────────────────────────────────────
public record StrengthDto(int Id, string Title, string Description, int DisplayOrder, bool IsActive);

public record CreateStrengthDto(
    [Required, MaxLength(100)] string Title,
    [Required, MaxLength(500)] string Description,
    int DisplayOrder
);

public record UpdateStrengthDto(
    [Required, MaxLength(100)] string Title,
    [Required, MaxLength(500)] string Description,
    int DisplayOrder,
    bool IsActive
);

// ─── CONTACT ───────────────────────────────────────────────────
public record ContactInquiryDto(int Id, string Name, string Email, string Company, string Message, bool IsRead, bool IsArchived, DateTime CreatedAt);

public record CreateContactDto(
    [Required, MaxLength(150)] string Name,
    [Required, EmailAddress, MaxLength(200)] string Email,
    [MaxLength(200)] string Company,
    [Required, MaxLength(2000)] string Message
);

// ─── AUTH ───────────────────────────────────────────────────────
public record LoginDto(
    [Required] string Username,
    [Required] string Password
);

public record AuthResponseDto(string Token, string Username, DateTime ExpiresAt);

// ─── ADMIN USER MANAGEMENT ──────────────────────────────────────
public record AdminUserDto(int Id, string Username, string Email, DateTime CreatedAt);

public record CreateAdminUserDto(
    [Required, MaxLength(100)] string Username,
    [Required, MinLength(6)] string Password,
    [Required, EmailAddress, MaxLength(200)] string Email
);

public record ChangePasswordDto(
    [Required] string CurrentPassword,
    [Required, MinLength(6)] string NewPassword
);

// ─── SITE SETTINGS ─────────────────────────────────────────────
public record SiteSettingDto(int Id, string Key, string Value);

public record UpdateSiteSettingDto(
    [Required, MaxLength(100)] string Key,
    [Required, MaxLength(1000)] string Value
);

// ─── GALLERY IMAGE ────────────────────────────────────────────
public record GalleryImageDto(int Id, string Title, string ImageUrl, string Category, bool IsActive, int DisplayOrder, DateTime CreatedAt);

public record CreateGalleryImageDto(
    [Required, MaxLength(200)] string Title,
    [Required, MaxLength(500)] string ImageUrl,
    [Required, MaxLength(50)] string Category,
    int DisplayOrder
);

public record UpdateGalleryImageDto(
    [Required, MaxLength(200)] string Title,
    [Required, MaxLength(500)] string ImageUrl,
    [Required, MaxLength(50)] string Category,
    bool IsActive,
    int DisplayOrder
);

// ─── CATEGORY ─────────────────────────────────────────────────
public record CategoryDto(int Id, string Name, int DisplayOrder, bool IsActive);

public record CreateCategoryDto(
    [Required, MaxLength(50)] string Name,
    int DisplayOrder
);

public record UpdateCategoryDto(
    [Required, MaxLength(50)] string Name,
    int DisplayOrder,
    bool IsActive
);

// ─── MAP COUNTRY ──────────────────────────────────────────────
public record MapCountryDto(int Id, string Name, double Latitude, double Longitude, bool IsHome, bool IsActive, int DisplayOrder);

public record CreateMapCountryDto(
    [Required, MaxLength(100)] string Name,
    double Latitude,
    double Longitude,
    bool IsHome,
    int DisplayOrder
);

public record UpdateMapCountryDto(
    [Required, MaxLength(100)] string Name,
    double Latitude,
    double Longitude,
    bool IsHome,
    bool IsActive,
    int DisplayOrder
);

// ─── TESTIMONIAL ──────────────────────────────────────────────
public record TestimonialDto(int Id, string Name, string Title, string Company, string Country,
    string Quote, int Rating, bool IsActive, int DisplayOrder);

public record CreateTestimonialDto(
    [Required, MaxLength(150)] string Name,
    [MaxLength(150)] string Title,
    [MaxLength(200)] string Company,
    [MaxLength(100)] string Country,
    [Required, MaxLength(1500)] string Quote,
    [Range(1, 5)] int Rating,
    int DisplayOrder
);

public record UpdateTestimonialDto(
    [Required, MaxLength(150)] string Name,
    [MaxLength(150)] string Title,
    [MaxLength(200)] string Company,
    [MaxLength(100)] string Country,
    [Required, MaxLength(1500)] string Quote,
    [Range(1, 5)] int Rating,
    bool IsActive,
    int DisplayOrder
);

// ─── PUBLIC SITE DATA (single endpoint for the frontend) ──────
public record SiteDataDto(
    List<StatCounterDto> Stats,
    List<ProductDto> Products,
    List<StrengthDto> Strengths,
    List<GalleryImageDto> Gallery,
    List<MapCountryDto> MapCountries,
    List<TestimonialDto> Testimonials,
    Dictionary<string, string> Settings
);
