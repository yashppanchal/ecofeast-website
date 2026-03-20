using EcoFeast.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EcoFeast.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<StatCounter> StatCounters => Set<StatCounter>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Strength> Strengths => Set<Strength>();
    public DbSet<ContactInquiry> ContactInquiries => Set<ContactInquiry>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
    public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();
    public DbSet<GalleryImage> GalleryImages => Set<GalleryImage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Unique constraint on setting keys
        modelBuilder.Entity<SiteSetting>()
            .HasIndex(s => s.Key)
            .IsUnique();

        // Unique constraint on admin username
        modelBuilder.Entity<AdminUser>()
            .HasIndex(a => a.Username)
            .IsUnique();
    }
}
