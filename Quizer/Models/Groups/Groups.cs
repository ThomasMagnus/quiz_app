using Microsoft.EntityFrameworkCore;
using Quizer.Context;

namespace Quizer.Models.Groups;

public class Groups
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<Users> Users { get; set; }
}

public class GroupsContext : ApplicationContext
{
    public DbSet<Groups>? Groups { get; set; }
    public GroupsContext()
        :base() {}
}