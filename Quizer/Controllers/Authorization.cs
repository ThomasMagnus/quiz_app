using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Serialization;
using Quizer.Models;
using Quizer.Models.Groups;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;

namespace Quizer.Controllers;

public class Authorization : Controller
{
    [HttpPost]
    public async Task<IActionResult>? Auth([FromBody] JsonElement value)
    {
        Dictionary<string, string>? data = JsonSerializer.Deserialize<Dictionary<string, string>>(value);
        using (UsersContext usersContext = new())
        {
            List<Users>? users = usersContext.Users?.ToList();


            try
            {
                Users? person = users?.FirstOrDefault(x => x.Firstname?.ToLower() == data?["firstname"].ToLower()
                                                               && x.Lastname?.ToLower() == data?["lastname"].ToLower()
                                                               && x.Password == data?["password"]);
                // Console.WriteLine(person?.GroupsId);

                if (person is null) { Console.WriteLine("Пользователь не найден!"); };

                List<Claim> claims = new List<Claim> { new Claim(ClaimsIdentity.DefaultNameClaimType, "Quizer") };

                ClaimsIdentity identity = new ClaimsIdentity(claims, "ApplicationCookie",
                    CookieAuthenticationDefaults.AuthenticationScheme, ClaimsIdentity.DefaultRoleClaimType);

                await HttpContext.SignInAsync(null, new ClaimsPrincipal(identity));

                Console.WriteLine("Успешно!");

                return RedirectToAction(actionName: "Index", controllerName: "UserPage");

            }
            catch (Exception ex) {
                Console.WriteLine(ex.Message);
                return (IActionResult)Response.WriteAsync("Ошибка авторизации");
            }
        }
    }

    [HttpGet]
    public JsonResult? GetGroups()
    {
        using (GroupsContext grpoupsContext = new())
        {
            try
            {
                List<Groups>? groups = grpoupsContext.Groups?.ToList();
                string[]? groupsName = groups?.Select(x => x.Name).ToArray();

                return Json(groupsName);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return null;
            }
        }
    }
}