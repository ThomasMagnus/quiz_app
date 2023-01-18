using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Serialization;
using Quizer.Models;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Quizer.HelperClasses;
using Quizer.Context;

namespace Quizer.Controllers;

public class Authorization : Controller
{

    private readonly JwtSettings _options;
    private string _token;

    public Authorization(IOptions<JwtSettings> options)
    {
        _options = options.Value;
    }

    [HttpPost]
    public async Task<IActionResult>? Auth([FromBody] JsonElement value)
    {
        Dictionary<string, string>? data = JsonSerializer.Deserialize<Dictionary<string, string>>(value);
        using ApplicationContext applicationContext = new();

        UsersServices usersServices = new() { db = applicationContext };
        
        try
        {

            Users? person = await usersServices.GetEntity(new Dictionary<string, object>
            {
                {"firstname", data?["firstname"].ToLower()},
                {"lastname",  data?["lastname"].ToLower()},
                {"password", data?["password"]},
                {"group", Int32.Parse(data?["group"].ToString())}
            });
                
            if (person is null) { return Json("Пользователь не найден"); }
            else
            {
                string username = $"{person?.Firstname?.Replace(" ", "")} " +
                                                    $"{person?.Lastname?.Replace(" ", "")}";

                TokenSecurity tokenSecurity = new(_options, username);

                _token = tokenSecurity.GetToken();

                var response = new
                {
                    accessToken = _token,
                    username = tokenSecurity._claimsCreator.GetClaims().Name,
                    id = person?.Id
                };

                UserPropertyCreator userPropertyCreator = new (
                    firstname: person?.Firstname,
                    lastname: person?.Lastname,
                    group: applicationContext?.Groups?.ToList().First(x => x.Id == Int32.Parse(data?["group"])).Name,
                    id: person?.Id);

                userPropertyCreator.CreateUser();

                using SessionsContext sessionsContext = new();
                sessionsContext.Sessions.Add(new Sessions()
                {
                    UserId = person?.Id,
                    UserFirstname = person?.Firstname,
                    UserLastname = person?.Lastname,
                    Enterdate = DateTime.Now,
                });
                sessionsContext.SaveChanges();

                return Json(response);
            }

        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.ToString());
            return Json("Ошибка авторизации");
        }
    }

    [HttpGet]
    public JsonResult? GetGroups()
    {
        try
        {
            using ApplicationContext grpoupsContext = new();
            List<Groups>? groups = grpoupsContext.Groups?.ToList();
            string[][]? groupsName = groups?.Select(x => new string[] {x.Name, x.Id.ToString()}).ToArray();

            return Json(groupsName);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return null;
        }
    }

    [HttpPost]
    public IActionResult DetectToken([FromBody] JsonElement value)
    {
        Dictionary<string, string>? data = JsonSerializer.Deserialize<Dictionary<string, string>>(value);
        bool result = data?["accessToken"] == _token;
        return Json(new Dictionary<string, bool> {
            {"access", result}
        });
    }

}