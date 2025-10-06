using System;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PopStarManagerAPI.Data;
using PopStarManagerAPI.Models;

namespace PopStarManagerAPI.Controllers
{
    [Route("api/talent")]
    [ApiController]
    public class TalentController : ControllerBase
    {
        private readonly TalentHubContext _context;
        private readonly IWebHostEnvironment _environment;

        public TalentController(TalentHubContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TalentProfile>>> GetTalentProfiles()
        {
            return await _context.TalentProfiles.AsNoTracking().ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TalentProfile>> GetTalentProfile(int id)
        {
            var profile = await _context.TalentProfiles.FindAsync(id);
            if (profile == null)
            {
                return NotFound();
            }

            return profile;
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<TalentProfile>>> SearchTalentProfiles([FromQuery] string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return await _context.TalentProfiles.AsNoTracking().ToListAsync();
            }

            var loweredName = name.Trim();

            return await _context.TalentProfiles
                .AsNoTracking()
                .Where(profile => EF.Functions.Like(profile.Name, $"%{loweredName}%"))
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<TalentProfile>> CreateTalentProfile([FromForm] TalentProfileCreateModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var imageUrl = await SaveImageAsync(model.ImageFile);

            var profile = new TalentProfile
            {
                Name = model.Name,
                Category = model.Category,
                PricePerHour = model.PricePerHour,
                Email = NormalizeContact(model.Email),
                Phone = NormalizeContact(model.Phone),
                ImageUrl = imageUrl
            };

            _context.TalentProfiles.Add(profile);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTalentProfile), new { id = profile.Id }, profile);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTalentProfile(int id, [FromForm] TalentProfileCreateModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingProfile = await _context.TalentProfiles.FindAsync(id);
            if (existingProfile == null)
            {
                return NotFound();
            }

            existingProfile.Name = model.Name;
            existingProfile.Category = model.Category;
            existingProfile.PricePerHour = model.PricePerHour;
            existingProfile.Email = NormalizeContact(model.Email);
            existingProfile.Phone = NormalizeContact(model.Phone);

            if (model.ImageFile != null)
            {
                DeleteImageIfExists(existingProfile.ImageUrl);
                existingProfile.ImageUrl = await SaveImageAsync(model.ImageFile);
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTalentProfile(int id)
        {
            var profile = await _context.TalentProfiles.FindAsync(id);
            if (profile == null)
            {
                return NotFound();
            }

            DeleteImageIfExists(profile.ImageUrl);

            _context.TalentProfiles.Remove(profile);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private static string? NormalizeContact(string? value)
        {
            return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
        }

        private async Task<string?> SaveImageAsync(IFormFile? file)
        {
            if (file == null || file.Length == 0)
            {
                return null;
            }

            var imagesFolder = Path.Combine(_environment.ContentRootPath, "wwwroot", "images");
            if (!Directory.Exists(imagesFolder))
            {
                Directory.CreateDirectory(imagesFolder);
            }

            var safeFileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
            var filePath = Path.Combine(imagesFolder, safeFileName);

            await using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            return $"/images/{safeFileName}";
        }

        private void DeleteImageIfExists(string? imageUrl)
        {
            if (string.IsNullOrWhiteSpace(imageUrl))
            {
                return;
            }

            var filePath = Path.Combine(_environment.ContentRootPath, "wwwroot", imageUrl.TrimStart('/'));

            if (System.IO.File.Exists(filePath))
            {
                System.IO.File.Delete(filePath);
            }
        }
    }
}


