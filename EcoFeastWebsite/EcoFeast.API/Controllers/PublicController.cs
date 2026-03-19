using EcoFeast.API.Data;
using EcoFeast.API.DTOs;
using EcoFeast.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EcoFeast.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PublicController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IEmailService _email;

    public PublicController(AppDbContext db, IEmailService email)
    {
        _db = db;
        _email = email;
    }

    /// <summary>
    /// GET /api/public/sitedata
    /// Returns all data the frontend needs in a single request.
    /// Think of it like a "view model" endpoint — one call, all the data.
    /// </summary>
    [HttpGet("sitedata")]
    public async Task<ActionResult<SiteDataDto>> GetSiteData()
    {
        var stats = await _db.StatCounters
            .OrderBy(s => s.DisplayOrder)
            .Select(s => new StatCounterDto(s.Id, s.Label, s.Value, s.Suffix, s.DisplayOrder))
            .ToListAsync();

        var products = await _db.Products
            .Where(p => p.IsActive)
            .OrderBy(p => p.DisplayOrder)
            .Select(p => new ProductDto(p.Id, p.Name, p.HsCode, p.Category, p.Emoji, p.IsActive, p.DisplayOrder))
            .ToListAsync();

        var strengths = await _db.Strengths
            .Where(s => s.IsActive)
            .OrderBy(s => s.DisplayOrder)
            .Select(s => new StrengthDto(s.Id, s.Title, s.Description, s.DisplayOrder, s.IsActive))
            .ToListAsync();

        var settings = await _db.SiteSettings
            .ToDictionaryAsync(s => s.Key, s => s.Value);

        return Ok(new SiteDataDto(stats, products, strengths, settings));
    }

    /// <summary>
    /// POST /api/public/contact
    /// Receives inquiry from the contact form. No auth needed.
    /// </summary>
    [HttpPost("contact")]
    public async Task<ActionResult> SubmitContact([FromBody] CreateContactDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var inquiry = new Models.ContactInquiry
        {
            Name = dto.Name,
            Email = dto.Email,
            Company = dto.Company ?? "",
            Message = dto.Message
        };

        _db.ContactInquiries.Add(inquiry);
        await _db.SaveChangesAsync();

        // Send email notification (fire-and-forget, won't block response)
        _ = _email.SendInquiryNotificationAsync(dto.Name, dto.Email, dto.Company ?? "", dto.Message);

        return Ok(new { message = "Inquiry submitted successfully", id = inquiry.Id });
    }
}
