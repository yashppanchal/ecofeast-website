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
public record ProductDto(int Id, string Name, string HsCode, string Category, string Emoji, bool IsActive, int DisplayOrder);

public record CreateProductDto(
    [Required, MaxLength(150)] string Name,
    [Required, MaxLength(20)] string HsCode,
    [Required, MaxLength(50)] string Category,
    [MaxLength(10)] string Emoji,
    int DisplayOrder
);

public record UpdateProductDto(
    [Required, MaxLength(150)] string Name,
    [Required, MaxLength(20)] string HsCode,
    [Required, MaxLength(50)] string Category,
    [MaxLength(10)] string Emoji,
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
public record ContactInquiryDto(int Id, string Name, string Email, string Company, string Message, bool IsRead, DateTime CreatedAt);

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

// ─── PUBLIC SITE DATA (single endpoint for the frontend) ──────
public record SiteDataDto(
    List<StatCounterDto> Stats,
    List<ProductDto> Products,
    List<StrengthDto> Strengths,
    Dictionary<string, string> Settings
);
