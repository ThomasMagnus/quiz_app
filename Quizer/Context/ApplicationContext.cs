using Microsoft.EntityFrameworkCore;
using Quizer.Models;

namespace Quizer.Context;

public class ApplicationContext : DbContext
{
    public DbSet<Users> Users { get; set; }
    public DbSet<Groups> Groups { get; set; }
    public DbSet<Subjects> subjects { get; set; }
    public DbSet<Tasks> tasks { get; set; }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=Quizer;Username=postgres;" +
                                 "Password=Hofman95");
    }
    
}