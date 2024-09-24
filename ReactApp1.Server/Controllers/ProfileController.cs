using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using ReactApp1.Server.Data;
using System.IO;
using System.Threading.Tasks;
using System.Security.Claims;
using System.Diagnostics;

[ApiController]
[Route("api/[controller]")]
public class ProfilePictureController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly string _storagePath;

    public ProfilePictureController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
        _storagePath = Path.Combine(Directory.GetCurrentDirectory(), "ProfilePictures");
        if (!Directory.Exists(_storagePath))
        {
            Directory.CreateDirectory(_storagePath);
        }
    }
    [Authorize]
    [HttpPost("upload")]
    public async Task<IActionResult> UploadProfilePicture(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        var extension = Path.GetExtension(file.FileName).ToLower();
        var fileName = Path.GetRandomFileName() + extension;
        var filePath = Path.Combine(_storagePath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

            {
                var processInfo = new ProcessStartInfo
                {
                    FileName = "/bin/bash",
                    Arguments = filePath,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using (var process = Process.Start(processInfo))
                {

                    var output = await process.StandardOutput.ReadToEndAsync();
                    var error = await process.StandardError.ReadToEndAsync();
                    await process.WaitForExitAsync();
                }
            }
        

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized();
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        user.ProfilePictureUrl = $"/ProfilePictures/{fileName}";
        await _userManager.UpdateAsync(user);

        return Ok(new { filePath = user.ProfilePictureUrl });
    }
    [Authorize]
    [HttpGet("url")]
    public async Task<IActionResult> GetProfilePictureUrl()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            return Unauthorized();
        }
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return NotFound("User not found.");
        }
        if (string.IsNullOrEmpty(user.ProfilePictureUrl))
        {
            return NotFound("Profile picture not found.");
        }
        return Ok(new { ProfilePictureUrl = user.ProfilePictureUrl });
    }
    [Authorize]
    [HttpGet("ProfilePictures/{fileName}")]
    public IActionResult GetProfilePicture(string fileName)
    {
        var filePath = Path.Combine(_storagePath, fileName);

        if (System.IO.File.Exists(filePath))
        {
            var fileExtension = Path.GetExtension(fileName).ToLower();
            string contentType;

            switch (fileExtension)
            {
                case ".jpg":
                case ".jpeg":
                    contentType = "image/jpeg";
                    break;
                case ".png":
                    contentType = "image/png";
                    break;
                case ".gif":
                    contentType = "image/gif";
                    break;
                default:
                    contentType = "application/octet-stream";
                    break;
            }

            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            return File(fileStream, contentType);
        }

        return NotFound();
    }
}