using Microsoft.AspNetCore.Mvc;
using Quizer.Models;
using Microsoft.Extensions.Options;
using Quizer.HelperClasses;
using Quizer.Context;
using Microsoft.AspNetCore.Authorization;

namespace Quizer.Controllers;

public class Authorization : Controller
{

    private readonly JwtSettings _options;
    private string? _token;
    private readonly ILogger<Authorization> _logger;

    public Authorization(IOptions<JwtSettings> options, ILogger<Authorization> logger)
    {
        _logger = logger;
        _options = options.Value;
    }

    [HttpPost, Route("Authorization/Auth")]
    public async Task<IActionResult>? Auth()
    {
        using ApplicationContext applicationContext = new();
        using SubjectsContext subjectsContext = new();

        UsersServices usersServices = new() { db = applicationContext };

        try
        {
            Users? userData = await HttpContext.Request.ReadFromJsonAsync<Users>();

            Users? person = await usersServices.GetEntity(new Dictionary<string, object>
            {
                    {"firstname", userData?.Firstname?.ToLower()!},
                    {"lastname", userData?.Lastname?.ToLower()!},
                    {"patronymic", userData?.Patronymic?.ToLower()!},
                    {"password", int.Parse(userData?.Password!)},
                    {"group", userData?.GroupsId ?? '1'}
            });
            
            if (person is null) {
                            
                var response = new
                {
                    status = false,
                    text = "Пользователь не найден"
                };

                return Json(response);
            }
            else
            {
                GroupsServices groupsServices = new GroupsServices { db = applicationContext };

                List<Groups> groupsList = await groupsServices.EntityLIst();
                
                string username = $"{person?.Firstname?.Replace(" ", "")} " +
                                                    $"{person?.Lastname?.Replace(" ", "")}";

                List<Subjects> subjectsList = subjectsContext.subjects!.ToList();
                TokenSecurity tokenSecurity = new(_options, username);

                _token = tokenSecurity.GetToken();

                var response = new
                {
                    accessToken = _token,
                    username = tokenSecurity._claimsCreator.GetClaims().Name,
                    group = groupsList?.FirstOrDefault(x => x?.Id == userData?.GroupsId)?.Name,
                    id = person?.Id
                };

                Sessions.CreateSession(person?.Id, person?.Firstname, person?.Lastname, DateTime.Now);

                return Json(response);
            }

        }
        catch (Exception ex)
        {
            _logger.LogError(ex.ToString());
            var response = new
            {
                status = false,
                text = "Ошибка авторизации"
            };
            return Json(response);
        }
    }

    [HttpGet, Route("Authorization/GetGroups")]
    public JsonResult? GetGroups()
    {
        try
        {
            using ApplicationContext grpoupsContext = new();
            List<Groups>? groups = grpoupsContext.Groups?.ToList();
            string[][]? groupsName = groups?.Select(x => new string[] {x?.Name!, x?.Id.ToString()!}).ToArray();

            return Json(groupsName);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return null;
        }
    }

    [HttpGet]
    [Authorize]
    public JsonResult DetectToken()
    {
        Console.WriteLine("Auth success");
        return Json(new Dictionary<string, bool> {
            {"access", true}
        });
    }

}