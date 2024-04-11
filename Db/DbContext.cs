using BitsOrchestraTest.Models;
using Microsoft.EntityFrameworkCore;

namespace BitsOrchestraTest.Db
{
    public class PersonDbContext : DbContext
    {
        public DbSet<PersonModel> People { get; set; }

        public PersonDbContext(DbContextOptions<PersonDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PersonModel>().HasKey(p => p.Id);
            modelBuilder.Entity<PersonModel>().Property(p => p.Salary).HasColumnType("decimal(18, 2)").HasConversion<double>();
        }
    }
}