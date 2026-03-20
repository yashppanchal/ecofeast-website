namespace EcoFeast.API.Services;

/// <summary>
/// Abstraction for file storage. Swap LocalStorageService for CloudinaryStorageService
/// when you want cloud-based image hosting.
/// </summary>
public interface IStorageService
{
    /// <summary>Upload a file and return its public URL path.</summary>
    Task<string> UploadAsync(Stream fileStream, string fileName, string folder);

    /// <summary>Delete a previously uploaded file by its URL path.</summary>
    Task DeleteAsync(string fileUrl);
}
