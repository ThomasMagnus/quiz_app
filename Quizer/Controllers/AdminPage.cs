using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Quizer.Controllers
{
    public class AdminPage : Controller
    {
        [HttpGet]
        [Authorize]
        public void Index()
        {
            Console.WriteLine("Admin page");
        }
    }
}
