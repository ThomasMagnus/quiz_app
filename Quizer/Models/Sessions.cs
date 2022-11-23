using Microsoft.EntityFrameworkCore;
using Quizer.Context;

namespace Quizer.Models
{
    public class Sessions
    {
        public int? id { get; set; }
        public int? userid { get; set; }
        public string? userfirstname { get; set; }
        public string? userlastname { get; set; }
        public DateTime? enterdate { get; set; }
        public List<Users> Users { get; set; }
    }

    public class SessionsContext : ApplicationContext
    {
        public DbSet<Sessions> sessions { get; set; }

        public SessionsContext()
            :base() { }
    }
}
