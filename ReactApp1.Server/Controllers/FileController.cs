using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Data;

[ApiController]
[Route("api/[controller]")]
public class FileController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public FileController(ApplicationDbContext context)
    {
        _context = context;
    }
    [Authorize]
    [HttpPost("upload")]
    public async Task<IActionResult> UploadFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        var uploadedFile = new UploadedFile
        {
            FileName = file.FileName,
            ContentType = file.ContentType,
            UploadedAt = DateTime.UtcNow,
            FileSize = file.Length
        };

        using (var memoryStream = new MemoryStream())
        {
            await file.CopyToAsync(memoryStream);
            uploadedFile.Data = memoryStream.ToArray();
        }

        _context.UploadedFiles.Add(uploadedFile);
        await _context.SaveChangesAsync();

        return Ok(new { id = uploadedFile.Id });
    }
    [Authorize]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FilesInfo>>> GetUploadedFiles([FromQuery] string search = "")
    {
        var query = _context.UploadedFiles.AsQueryable();

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(f => EF.Functions.Like(f.FileName, $"%{search}%"));
        }

        var files = await query
            .Select(f => new FilesInfo
            {
                FileName = f.FileName,
                ContentType = f.ContentType,
                Id = f.Id,
                UploadedAt = f.UploadedAt,
                FileSize = f.FileSize
            })
            .ToListAsync();

        return Ok(files);
    }
    [Authorize]
    [HttpGet("download/{id}")]
    public async Task<IActionResult> DownloadFile(string id)
    {
        var connectionString = "Server=db;Database=mydatabase;User Id=sa;Password=Your_password123;TrustServerCertificate=True;";

        using (var connection = new SqlConnection(connectionString))
        {
            await connection.OpenAsync();

            var query = $"SELECT Data, ContentType, FileName FROM UploadedFiles WHERE Id = {id}";

            using (var command = new SqlCommand(query, connection))
            {
                using (var reader = await command.ExecuteReaderAsync())
                {
                    if (!await reader.ReadAsync())
                    {
                        return NotFound("File not found.");
                    }

                    var data = (byte[])reader["Data"];
                    var contentType = reader["ContentType"].ToString();
                    var fileName = reader["FileName"].ToString();

                    return File(data, contentType, fileName);
                }
            }
        }
    }
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFile(int id)
    {
        var file = await _context.UploadedFiles.FindAsync(id);
        if (file == null)
        {
            return NotFound();
        }

        _context.UploadedFiles.Remove(file);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
