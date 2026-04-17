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
    // MAP COUNTRIES
    // ═══════════════════════════════════════════════════════════

    [HttpGet("mapcountries")]
    public async Task<ActionResult<List<MapCountryDto>>> GetMapCountries()
    {
        var items = await _db.MapCountries
            .OrderBy(m => m.DisplayOrder)
            .Select(m => new MapCountryDto(m.Id, m.Name, m.Latitude, m.Longitude, m.IsHome, m.IsActive, m.DisplayOrder))
            .ToListAsync();
        return Ok(items);
    }

    [HttpPost("mapcountries")]
    public async Task<ActionResult> CreateMapCountry([FromBody] CreateMapCountryDto dto)
    {
        if (await _db.MapCountries.AnyAsync(m => m.Name == dto.Name))
            return BadRequest(new { message = "A country with this name already exists" });

        // If this one is marked home, clear any previous home
        if (dto.IsHome)
        {
            var currentHome = await _db.MapCountries.Where(m => m.IsHome).ToListAsync();
            foreach (var h in currentHome) h.IsHome = false;
        }

        var item = new MapCountry
        {
            Name = dto.Name,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude,
            IsHome = dto.IsHome,
            DisplayOrder = dto.DisplayOrder
        };
        _db.MapCountries.Add(item);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetMapCountries), new { id = item.Id }, item);
    }

    [HttpPut("mapcountries/{id}")]
    public async Task<ActionResult> UpdateMapCountry(int id, [FromBody] UpdateMapCountryDto dto)
    {
        var item = await _db.MapCountries.FindAsync(id);
        if (item == null) return NotFound();

        if (await _db.MapCountries.AnyAsync(m => m.Name == dto.Name && m.Id != id))
            return BadRequest(new { message = "A country with this name already exists" });

        // If this one is becoming home, clear other homes
        if (dto.IsHome && !item.IsHome)
        {
            var otherHomes = await _db.MapCountries.Where(m => m.IsHome && m.Id != id).ToListAsync();
            foreach (var h in otherHomes) h.IsHome = false;
        }

        item.Name = dto.Name;
        item.Latitude = dto.Latitude;
        item.Longitude = dto.Longitude;
        item.IsHome = dto.IsHome;
        item.IsActive = dto.IsActive;
        item.DisplayOrder = dto.DisplayOrder;

        await _db.SaveChangesAsync();
        return Ok(new { message = "Country updated" });
    }

    [HttpDelete("mapcountries/{id}")]
    public async Task<ActionResult> DeleteMapCountry(int id)
    {
        var item = await _db.MapCountries.FindAsync(id);
        if (item == null) return NotFound();

        _db.MapCountries.Remove(item);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Country deleted" });
    }

    // ═══════════════════════════════════════════════════════════
    // TESTIMONIALS
    // ═══════════════════════════════════════════════════════════

    [HttpGet("testimonials")]
    public async Task<ActionResult<List<TestimonialDto>>> GetTestimonials()
    {
        var items = await _db.Testimonials
            .OrderBy(t => t.DisplayOrder)
            .Select(t => new TestimonialDto(t.Id, t.Name, t.Title, t.Company, t.Country, t.Quote, t.Rating, t.IsActive, t.DisplayOrder))
            .ToListAsync();
        return Ok(items);
    }

    [HttpPost("testimonials")]
    public async Task<ActionResult> CreateTestimonial([FromBody] CreateTestimonialDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var item = new Testimonial
        {
            Name = dto.Name,
            Title = dto.Title ?? "",
            Company = dto.Company ?? "",
            Country = dto.Country ?? "",
            Quote = dto.Quote,
            Rating = dto.Rating,
            DisplayOrder = dto.DisplayOrder
        };
        _db.Testimonials.Add(item);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Testimonial added", id = item.Id });
    }

    [HttpPut("testimonials/{id}")]
    public async Task<ActionResult> UpdateTestimonial(int id, [FromBody] UpdateTestimonialDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var item = await _db.Testimonials.FindAsync(id);
        if (item == null) return NotFound();

        item.Name = dto.Name;
        item.Title = dto.Title ?? "";
        item.Company = dto.Company ?? "";
        item.Country = dto.Country ?? "";
        item.Quote = dto.Quote;
        item.Rating = dto.Rating;
        item.IsActive = dto.IsActive;
        item.DisplayOrder = dto.DisplayOrder;

        await _db.SaveChangesAsync();
        return Ok(new { message = "Testimonial updated" });
    }

    [HttpDelete("testimonials/{id}")]
    public async Task<ActionResult> DeleteTestimonial(int id)
    {
        var item = await _db.Testimonials.FindAsync(id);
        if (item == null) return NotFound();

        _db.Testimonials.Remove(item);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Testimonial deleted" });
    }

    // ═══════════════════════════════════════════════════════════
    // CATEGORIES
    // ═══════════════════════════════════════════════════════════

    [HttpGet("categories")]
    public async Task<ActionResult<List<CategoryDto>>> GetCategories()
    {
        var items = await _db.Categories
            .OrderBy(c => c.DisplayOrder)
            .Select(c => new CategoryDto(c.Id, c.Name, c.DisplayOrder, c.IsActive))
            .ToListAsync();
        return Ok(items);
    }

    [HttpPost("categories")]
    public async Task<ActionResult> CreateCategory([FromBody] CreateCategoryDto dto)
    {
        if (await _db.Categories.AnyAsync(c => c.Name == dto.Name))
            return BadRequest(new { message = "A category with this name already exists" });

        var item = new Category
        {
            Name = dto.Name,
            DisplayOrder = dto.DisplayOrder
        };
        _db.Categories.Add(item);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetCategories), new { id = item.Id }, item);
    }

    [HttpPut("categories/{id}")]
    public async Task<ActionResult> UpdateCategory(int id, [FromBody] UpdateCategoryDto dto)
    {
        var item = await _db.Categories.FindAsync(id);
        if (item == null) return NotFound();

        if (await _db.Categories.AnyAsync(c => c.Name == dto.Name && c.Id != id))
            return BadRequest(new { message = "A category with this name already exists" });

        item.Name = dto.Name;
        item.DisplayOrder = dto.DisplayOrder;
        item.IsActive = dto.IsActive;

        await _db.SaveChangesAsync();
        return Ok(new { message = "Category updated" });
    }

    [HttpDelete("categories/{id}")]
    public async Task<ActionResult> DeleteCategory(int id)
    {
        var item = await _db.Categories.FindAsync(id);
        if (item == null) return NotFound();

        // Frontend confirms with the user before calling delete; products that
        // referenced this category by name keep the old string (intentional).
        _db.Categories.Remove(item);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Category deleted" });
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
            .Select(c => new ContactInquiryDto(c.Id, c.Name, c.Email, c.Company, c.Message, c.IsRead, c.IsArchived, c.CreatedAt))
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

    [HttpPut("inquiries/{id}/unread")]
    public async Task<ActionResult> MarkAsUnread(int id)
    {
        var inquiry = await _db.ContactInquiries.FindAsync(id);
        if (inquiry == null) return NotFound();

        inquiry.IsRead = false;
        await _db.SaveChangesAsync();
        return Ok(new { message = "Marked as unread" });
    }

    [HttpPut("inquiries/{id}/archive")]
    public async Task<ActionResult> ArchiveInquiry(int id)
    {
        var inquiry = await _db.ContactInquiries.FindAsync(id);
        if (inquiry == null) return NotFound();

        inquiry.IsArchived = true;
        await _db.SaveChangesAsync();
        return Ok(new { message = "Archived" });
    }

    [HttpPut("inquiries/{id}/unarchive")]
    public async Task<ActionResult> UnarchiveInquiry(int id)
    {
        var inquiry = await _db.ContactInquiries.FindAsync(id);
        if (inquiry == null) return NotFound();

        inquiry.IsArchived = false;
        await _db.SaveChangesAsync();
        return Ok(new { message = "Restored" });
    }

    [HttpDelete("inquiries/{id}")]
    public async Task<ActionResult> DeleteInquiry(int id)
    {
        var inquiry = await _db.ContactInquiries.FindAsync(id);
        if (inquiry == null) return NotFound();

        _db.ContactInquiries.Remove(inquiry);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Deleted" });
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

    [HttpDelete("settings/{id}")]
    public async Task<ActionResult> DeleteSetting(int id)
    {
        var setting = await _db.SiteSettings.FindAsync(id);
        if (setting == null) return NotFound();
        _db.SiteSettings.Remove(setting);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Setting deleted" });
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
