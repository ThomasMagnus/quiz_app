using Microsoft.EntityFrameworkCore;

namespace Quizer.Context;

public abstract class ApplicationContext : DbContext
{
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=Quizer;Username=postgres;" +
                                 "Password=Hofman95");
    }
    
}