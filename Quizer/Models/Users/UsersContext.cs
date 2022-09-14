using Quizer.Context;
using Microsoft.EntityFrameworkCore;

namespace Quizer.Models;

public class UsersContext : ApplicationContext
{
    public DbSet<Users>? Users { get; set; }

    public UsersContext()
        :base(){}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Users>()
            .HasOne(x => x.Groups)
            .WithMany(y => y.Users)
            .HasForeignKey(p => p.GroupsId)
            .HasPrincipalKey(t => t.Id);
    }
}