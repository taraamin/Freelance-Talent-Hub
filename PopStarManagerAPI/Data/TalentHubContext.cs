using Microsoft.EntityFrameworkCore;
using PopStarManagerAPI.Models;

namespace PopStarManagerAPI.Data
{
    public class TalentHubContext : DbContext
    {
        public TalentHubContext(DbContextOptions<TalentHubContext> options) : base(options) { }

        public DbSet<TalentProfile> TalentProfiles { get; set; } = null!;
    }
}
