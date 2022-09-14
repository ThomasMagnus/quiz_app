using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Quizer.Controllers
{
    public class UserPage : Controller
    {
        [HttpGet]
        [Authorize]
        public void Index()
        {
            Console.WriteLine($"Время: {DateTime.Now}");
        }
    }
}
