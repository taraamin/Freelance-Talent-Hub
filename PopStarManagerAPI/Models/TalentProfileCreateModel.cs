using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace PopStarManagerAPI.Models
{
    public class TalentProfileCreateModel
    {
        [Required]
        [StringLength(80)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(60)]
        public string Category { get; set; } = string.Empty;

        [Range(0, 100_000)]
        public decimal PricePerHour { get; set; }

        [EmailAddress]
        [StringLength(120)]
        public string? Email { get; set; }

        [Phone]
        [StringLength(40)]
        public string? Phone { get; set; }

        public IFormFile? ImageFile { get; set; }
    }
}
