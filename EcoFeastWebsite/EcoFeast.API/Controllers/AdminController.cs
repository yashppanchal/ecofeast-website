using EcoFeast.API.Data;
using EcoFeast.API.DTOs;
using EcoFeast.API.Models;
using EcoFeast.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EcoFeast.API.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IStorageService _storage;

    public AdminController(AppDbContext db, IStorageService storage)
    {
        _db = db;
        _storage = storage;
    }

    // ═══════════════════════════════════════════════════════════
    // STAT COUNTERS
    // ═══════════════════════════════════════════════════════════

    [HttpGet("stats")]
    public async Task<ActionResult<List<StatCounterDto>>> GetStats()
    {
        var stats = await _db.StatCounters
            .OrderBy(s => s.DisplayOrder)
            .Select(s => new StatCounterDto(s.Id, s.Label, s.Value, s.Suffix, s.DisplayOrder))
            .ToListAsync();
        return Ok(stats);
    }

    [HttpPut("stats/{id}")]
    public async Task<ActionResult> UpdateStat(int id, [FromBody] UpdateStatDto dto)
    {
        var stat = await _db.StatCounters.FindAsync(id);
        if (stat == null) return NotFound();

        stat.Label = dto.Label;
        stat.Value = dto.Value;
        stat.Suffix = dto.Suffix;
        stat.DisplayOrder = dto.DisplayOrder;
        stat.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(new { message = "Stat updated" });
    }

    // ═══════════════════════════════════════════════════════════
    // PRODUCTS
    // ═══════════════════════════════════════════════════════════

    [HttpGet("products")]
    public async Task<ActionResult<List<ProductDto>>> GetProducts()
    {
        var products = await _db.Products
            .OrderBy(p => p.DisplayOrder)
            .Select(p => new ProductDto(p.Id, p.Name, p.HsCode, p.Category, p.Emoji,
                p.ImageUrl, p.Description, p.Price, p.Currency, p.PriceUnit, p.IsActive, p.DisplayOrder))
            .ToListAsync();
        return Ok(products);
    }

    [HttpPost("products")]
    public async Task<ActionResult> CreateProduct([FromBody] CreateProductDto dto)
    {
        var product = new Product
        {
            Name = dto.Name,
            HsCode = dto.HsCode,
            Category = dto.Category,
            Emoji = dto.Emoji,
            ImageUrl = dto.ImageUrl ?? "",
            Description = dto.Description ?? "",
            Price = dto.Price,
            Currency = dto.Currency ?? "USD",
            PriceUnit = dto.PriceUnit ?? "/MT",
            DisplayOrder = dto.DisplayOrder
        };
        _db.Products.Add(product);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetProducts), new { id = product.Id }, product);
    }

    [HttpPut("products/{id}")]
    public async Task<ActionResult> UpdateProduct(int id, [FromBody] UpdateProductDto dto)
    {
        var product = await _db.Products.FindAsync(id);
        if (product == null) return NotFound();

        product.Name = dto.Name;
        product.HsCode = dto.HsCode;
        product.Category = dto.Category;
        product.Emoji = dto.Emoji;
        product.ImageUrl = dto.ImageUrl ?? "";
        product.Description = dto.Description ?? "";
        product.Price = dto.Price;
        product.Currency = dto.Currency ?? "USD";
        product.PriceUnit = dto.PriceUnit ?? "/MT";
        product.IsActive = dto.IsActive;
        product.DisplayOrder = dto.DisplayOrder;

        await _db.SaveChangesAsync();
        return Ok(new { message = "Product updated" });
    }

    [HttpDelete("products/{id}")]
    public async Task<ActionResult> DeleteProduct(int id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product == null) return NotFound();

        // Delete associated image file
        if (!string.IsNullOrEmpty(product.ImageUrl))
            await _storage.DeleteAsync(product.ImageUrl);

        _db.Products.Remove(product);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Product deleted" });
    }

    /// <summary>
    /// POST /api/admin/upload
    /// Uploads an image file and returns the URL path.
    /// Max 5MB, accepts jpg/jpeg/png/webp/gif/svg.
    /// </summary>
    [HttpPost("upload")]
    [RequestSizeLimit(5 * 1024 * 1024)] // 5MB
    public async Task<ActionResult> UploadImage(IFormFile file, [FromQuery] string folder = "products")
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "No file provided" });

        try
        {
            using var stream = file.OpenReadStream();
            var url = await _storage.UploadAsync(stream, file.FileName, folder);
            return Ok(new { url });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // ═══════════════════════════════════════════════════════════
    // STRENGTHS
    // ═══════════════════════════════════════════════════════════

    [HttpGet("strengths")]
    public async Task<ActionResult<List<StrengthDto>>> GetStrengths()
    {
        var items = await _db.Strengths
            .OrderBy(s => s.DisplayOrder)
            .Select(s => new StrengthDto(s.Id, s.Title, s.Description, s.DisplayOrder, s.IsActive))
            .ToListAsync();
        return Ok(items);
    }

    [HttpPost("strengths")]
    public async Task<ActionResult> CreateStrength([FromBody] CreateStrengthDto dto)
    {
        var item = new Strength
        {
            Title = dto.Title,
            Description = dto.Description,
            DisplayOrder = dto.DisplayOrder
        };
        _db.Strengths.Add(item);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetStrengths), new { id = item.Id }, item);
    }

    [HttpPut("strengths/{id}")]
    public async Task<ActionResult> UpdateStrength(int id, [FromBody] UpdateStrengthDto dto)
    {
        var item = await _db.Strengths.FindAsync(id);
        if (item == null) return NotFound();

        item.Title = dto.Title;
        item.Description = dto.Description;
        item.DisplayOrder = dto.DisplayOrder;
        item.IsActive = dto.IsActive;

        await _db.SaveChangesAsync();
        return Ok(new { message = "Strength updated" });
    }

    [HttpDelete("strengths/{id}")]
    public async Task<ActionResult> DeleteStrength(int id)
    {
        var item = await _db.Strengths.FindAsync(id);
        if (item == null) return NotFound();

        _db.Strengths.Remove(item);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Strength deleted" });
    }

    // ═══════════════════════════════════════════════════════════
    // GALLERY IMAGES
    // ═══════════════════════════════════════════════════════════

    [HttpGet("gallery")]
    public async Task<ActionResult<List<GalleryImageDto>>> GetGallery()
    {
        var items = await _db.GalleryImages
            .OrderByDescending(g => g.CreatedAt)
            .Select(g => new GalleryImageDto(g.Id, g.Title, g.ImageUrl, g.Category, g.IsActive, g.DisplayOrder, g.CreatedAt))
            .ToListAsync();
        return Ok(items);
    }

    [HttpPost("gallery")]
    public async Task<ActionResult> CreateGalleryImage([FromBody] CreateGalleryImageDto dto)
    {
        var item = new GalleryImage
        {
            Title = dto.Title,
            ImageUrl = dto.ImageUrl,
            Category = dto.Category,
            DisplayOrder = dto.DisplayOrder
        };
        _db.GalleryImages.Add(item);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetGallery), new { id = item.Id }, item);
    }

    [HttpPut("gallery/{id}")]
    public async Task<ActionResult> UpdateGalleryImage(int id, [FromBody] UpdateGalleryImageDto dto)
    {
        var item = await _db.GalleryImages.FindAsync(id);
        if (item == null) return NotFound();

        item.Title = dto.Title;
        item.ImageUrl = dto.ImageUrl;
        item.Category = dto.Category;
        item.IsActive = dto.IsActive;
        item.DisplayOrder = dto.DisplayOrder;

        await _db.SaveChangesAsync();
        return Ok(new { message = "Gallery image updated" });
    }

    [HttpDelete("gallery/{id}")]
    public async Task<ActionResult> DeleteGalleryImage(int id)
    {
        var item = await _db.GalleryImages.FindAsync(id);
        if (item == null) return NotFound();

        if (!string.IsNullOrEmpty(item.ImageUrl))
            await _storage.DeleteAsync(item.ImageUrl);

        _db.GalleryImages.Remove(item);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Gallery image deleted" });
    }

    // ═══════════════════════════════════════════════════════════
    // CONTACT INQUIRIES (read-only for admin)
    // ═══════════════════════════════════════════════════════════

    [HttpGet("inquiries")]
    public async Task<ActionResult<List<ContactInquiryDto>>> GetInquiries()
    {
        var items = await _db.ContactInquiries
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new ContactInquiryDto(c.Id, c.Name, c.Email, c.Company, c.Message, c.IsRead, c.CreatedAt))
            .ToListAsync();
        return Ok(items);
    }

    [HttpPut("inquiries/{id}/read")]
    public async Task<ActionResult> MarkAsRead(int id)
    {
        var inquiry = await _db.ContactInquiries.FindAsync(id);
        if (inquiry == null) return NotFound();

        inquiry.IsRead = true;
        await _db.SaveChangesAsync();
        return Ok(new { message = "Marked as read" });
    }

    // ═══════════════════════════════════════════════════════════
    // SITE SETTINGS
    // ═══════════════════════════════════════════════════════════

    [HttpGet("settings")]
    public async Task<ActionResult<List<SiteSettingDto>>> GetSettings()
    {
        var items = await _db.SiteSettings
            .Select(s => new SiteSettingDto(s.Id, s.Key, s.Value))
            .ToListAsync();
        return Ok(items);
    }

    [HttpPut("settings")]
    public async Task<ActionResult> UpdateSetting([FromBody] UpdateSiteSettingDto dto)
    {
        var setting = await _db.SiteSettings.FirstOrDefaultAsync(s => s.Key == dto.Key);
        if (setting == null)
        {
            setting = new SiteSetting { Key = dto.Key, Value = dto.Value };
            _db.SiteSettings.Add(setting);
        }
        else
        {
            setting.Value = dto.Value;
        }

        await _db.SaveChangesAsync();
        return Ok(new { message = "Setting updated" });
    }

    // ═══════════════════════════════════════════════════════════
    // ADMIN USER MANAGEMENT
    // ═══════════════════════════════════════════════════════════

    [HttpGet("users")]
    public async Task<ActionResult<List<AdminUserDto>>> GetUsers()
    {
        var users = await _db.AdminUsers
            .OrderBy(u => u.CreatedAt)
            .Select(u => new AdminUserDto(u.Id, u.Username, u.Email, u.CreatedAt))
            .ToListAsync();
        return Ok(users);
    }

    [HttpPost("users")]
    public async Task<ActionResult> CreateUser([FromBody] CreateAdminUserDto dto)
    {
        if (await _db.AdminUsers.AnyAsync(u => u.Username == dto.Username))
            return BadRequest(new { message = "Username already exists" });

        var user = new AdminUser
        {
            Username = dto.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Email = dto.Email
        };
        _db.AdminUsers.Add(user);
        await _db.SaveChangesAsync();
        return Ok(new { message = "User created", id = user.Id });
    }

    [HttpPut("users/change-password")]
    public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var username = User.Identity?.Name;
        var admin = await _db.AdminUsers.FirstOrDefaultAsync(a => a.Username == username);
        if (admin == null) return NotFound();

        if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, admin.PasswordHash))
            return BadRequest(new { message = "Current password is incorrect" });

        admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Password changed successfully" });
    }

    [HttpDelete("users/{id}")]
    public async Task<ActionResult> DeleteUser(int id)
    {
        var user = await _db.AdminUsers.FindAsync(id);
        if (user == null) return NotFound();

        var count = await _db.AdminUsers.CountAsync();
        if (count <= 1) return BadRequest(new { message = "Cannot delete the last admin user" });

        _db.AdminUsers.Remove(user);
        await _db.SaveChangesAsync();
        return Ok(new { message = "User deleted" });
    }
}
