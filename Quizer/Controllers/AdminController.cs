using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Quizer.Models;
using Quizer.HelperClasses;
using Microsoft.Extensions.Options;

namespace Quizer.Controllers
{
    public class AdminController : Controller
    {
        private readonly JwtSettings _options;
        public AdminController(IOptions<JwtSettings> options)
        {
            _options = options.Value;
        }

        [HttpPost]
        public IActionResult Index([FromBody] JsonElement value)
        {
            Console.WriteLine(value);
            Dictionary<string, string>? data = JsonSerializer.Deserialize<Dictionary<string, string>>(value);

            using AdminsContext adminContext = new();

            List<Admins> adminsList = adminContext.Admins.ToList();

            Admins? admin = adminsList.FirstOrDefault(x => x.firstname?.ToLower().Replace(" ", "") == data?["firstname"].Trim() 
                                                    && x.lastname?.ToLower().Replace(" ", "") == data?["lastname"].Trim());

            if (admin is null) { return Json("Администратор не найден"); }
            string username = String.Format("{0} {1}", admin?.firstname?.Replace(" ", ""), admin?.lastname?.Replace(" ", ""));
            TokenSecurity tokenSecurity = new(_options, username);
            string tokenHandler = tokenSecurity.GetToken();

            var response = new
            {
                accessAdminToken = tokenHandler,
                username = tokenSecurity._claimsCreator.GetClaims().Name,
                admin?.id
            };

            return Json(response);
        }
    }
}
