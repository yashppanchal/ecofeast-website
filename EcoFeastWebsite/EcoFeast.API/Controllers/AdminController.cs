using EcoFeast.API.Data;
using EcoFeast.API.DTOs;
using EcoFeast.API.Models;
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

    public AdminController(AppDbContext db) => _db = db;

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
            .Select(p => new ProductDto(p.Id, p.Name, p.HsCode, p.Category, p.Emoji, p.IsActive, p.DisplayOrder))
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

        _db.Products.Remove(product);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Product deleted" });
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
}
