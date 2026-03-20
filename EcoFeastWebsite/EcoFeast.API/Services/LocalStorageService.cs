namespace EcoFeast.API.Services;

/// <summary>
/// Stores files locally in wwwroot/uploads/.
/// To switch to Cloudinary later, create a CloudinaryStorageService
/// that implements IStorageService and register it in Program.cs instead.
/// </summary>
public class LocalStorageService : IStorageService
{
    private readonly IWebHostEnvironment _env;

    public LocalStorageService(IWebHostEnvironment env)
    {
        _env = env;
    }

    public async Task<string> UploadAsync(Stream fileStream, string fileName, string folder)
    {
        // Sanitize filename: keep extension, replace name with GUID
        var ext = Path.GetExtension(fileName).ToLowerInvariant();
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg" };
        if (!allowedExtensions.Contains(ext))
            throw new ArgumentException($"File type '{ext}' is not allowed. Use: {string.Join(", ", allowedExtensions)}");

        var safeName = $"{Guid.NewGuid()}{ext}";
        var uploadDir = Path.Combine(_env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot"), "uploads", folder);
        Directory.CreateDirectory(uploadDir);

        var filePath = Path.Combine(uploadDir, safeName);
        using var fs = new FileStream(filePath, FileMode.Create);
        await fileStream.CopyToAsync(fs);

        // Return URL path (relative to site root)
        return $"/uploads/{folder}/{safeName}";
    }

    public Task DeleteAsync(string fileUrl)
    {
        if (string.IsNullOrEmpty(fileUrl) || !fileUrl.StartsWith("/uploads/"))
            return Task.CompletedTask;

        var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
        var filePath = Path.Combine(webRoot, fileUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar));

        if (File.Exists(filePath))
            File.Delete(filePath);

        return Task.CompletedTask;
    }
}
