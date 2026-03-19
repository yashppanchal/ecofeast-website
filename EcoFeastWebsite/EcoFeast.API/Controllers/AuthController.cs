using EcoFeast.API.Data;
using EcoFeast.API.DTOs;
using EcoFeast.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EcoFeast.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ITokenService _tokenService;

    public AuthController(AppDbContext db, ITokenService tokenService)
    {
        _db = db;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto dto)
    {
        var admin = await _db.AdminUsers
            .FirstOrDefaultAsync(a => a.Username == dto.Username);

        if (admin == null || !BCrypt.Net.BCrypt.Verify(dto.Password, admin.PasswordHash))
            return Unauthorized(new { message = "Invalid username or password" });

        var token = _tokenService.GenerateToken(admin.Username, admin.Email);
        var expiresAt = DateTime.UtcNow.AddHours(24);

        return Ok(new AuthResponseDto(token, admin.Username, expiresAt));
    }
}
