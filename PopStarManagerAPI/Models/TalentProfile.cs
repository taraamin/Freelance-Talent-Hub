using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PopStarManagerAPI.Models
{
    [Table("PopStars")]
    public class TalentProfile
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(80)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(60)]
        public string Category { get; set; } = string.Empty;

        [Required]
        [Range(0, 100_000)]
        public decimal PricePerHour { get; set; }

        [EmailAddress]
        [StringLength(120)]
        public string? Email { get; set; }

        [Phone]
        [StringLength(40)]
        public string? Phone { get; set; }

        public string? ImageUrl { get; set; }
    }
}
