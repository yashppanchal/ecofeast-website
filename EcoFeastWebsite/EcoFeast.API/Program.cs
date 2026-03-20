using System.Text;
using EcoFeast.API.Data;
using EcoFeast.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ─── DATABASE ──────────────────────────────────────────────────
// Uses DATABASE_URL env var on Railway, falls back to appsettings for local dev
var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL");

if (!string.IsNullOrEmpty(connectionString) && connectionString.StartsWith("postgresql://"))
{
    // Railway provides a postgresql:// URI — convert to Npgsql format
    var uri = new Uri(connectionString);
    var userInfo = uri.UserInfo.Split(':');
    connectionString = $"Host={uri.Host};Port={uri.Port};Database={uri.AbsolutePath.TrimStart('/')};Username={userInfo[0]};Password={userInfo[1]};SSL Mode=Require;Trust Server Certificate=true";
}
else
{
    connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// ─── ENVIRONMENT VARIABLE OVERRIDES ─────────────────────────────
// Render/Railway use flat env vars — map them to .NET config sections
var envMappings = new Dictionary<string, string>
{
    { "JWT_KEY", "Jwt:Key" },
    { "EMAIL_SMTP_HOST", "Email:SmtpHost" },
    { "EMAIL_SMTP_PORT", "Email:SmtpPort" },
    { "EMAIL_SENDER_EMAIL", "Email:SenderEmail" },
    { "EMAIL_SENDER_PASSWORD", "Email:SenderPassword" },
    { "EMAIL_NOTIFY_EMAIL", "Email:NotifyEmail" },
};
foreach (var (envVar, configKey) in envMappings)
{
    var value = Environment.GetEnvironmentVariable(envVar);
    if (!string.IsNullOrEmpty(value))
        builder.Configuration[configKey] = value;
}

// ─── JWT AUTHENTICATION ────────────────────────────────────────
var jwtKey = builder.Configuration["Jwt:Key"]
    ?? "EcoFeast-Super-Secret-Key-Change-In-Production-2025!";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "EcoFeast.API",
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "EcoFeast.Client",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

// ─── SERVICES ──────────────────────────────────────────────────
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IEmailService, EmailService>();
// ── Image storage: swap LocalStorageService → CloudinaryStorageService when needed ──
builder.Services.AddScoped<IStorageService, LocalStorageService>();

// ─── CORS ──────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClient", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",   // Vite dev server
                "http://localhost:3000",   // Alternate dev port
                "https://*.up.railway.app" // Railway deployed frontend
            )
            .SetIsOriginAllowedToAllowWildcardSubdomains()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ─── CONTROLLERS + SWAGGER ─────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "EcoFeast Nutrients API",
        Version = "v1",
        Description = "API for EcoFeast Nutrients portfolio website"
    });

    // JWT auth in Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer {token}'"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

//// ─── STATIC FILES (serves React build in production) ──────────
//builder.Services.AddSpaStaticFiles(config =>
//{
//    config.RootPath = "wwwroot";
//});

var app = builder.Build();

// ─── MIGRATE & SEED DATABASE ───────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.MigrateAsync();
    await DbSeeder.SeedAsync(db);
}

// ─── MIDDLEWARE PIPELINE ───────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowClient");

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Fallback for SPA routing — serves index.html for non-API routes
app.MapFallbackToFile("index.html");

// ─── PORT BINDING (Railway sets PORT env var) ──────────────────
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
app.Urls.Add($"http://0.0.0.0:{port}");

app.Run();
