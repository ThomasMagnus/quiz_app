using Microsoft.EntityFrameworkCore;
using Quizer.Context;

namespace Quizer.Models
{
    public class Admins
    {
        public int id { get; set; }
        public string? firstname { get; set; }
        public string? lastname { get; set; }
        public string? password { get; set; }
        public string? email { get; set; }
        public DateTime? login_date { get; set; }
        public DateTime? logout_date { get; set; }
    }

    public class AdminsContext : ApplicationContext
    {
        public DbSet<Admins> Admins {get; set;}
        public AdminsContext()
            : base() { }
    }

}
