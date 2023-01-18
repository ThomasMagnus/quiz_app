using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Quizer.HelperClasses;
using Quizer.Models;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Quizer.Controllers
{
    public class TeacherController : Controller
    {
        private readonly JwtSettings? _jwtSettings;

        public TeacherController(IOptions<JwtSettings> jwtSettings) => _jwtSettings = jwtSettings.Value;

        [HttpPost]
        public async Task<IActionResult> Index()
        {
            try
            {
                Teacher? data = await HttpContext.Request.ReadFromJsonAsync<Teacher>();

                using TeacherContext teacherContext = new();

                List<Teacher> teacherList = await teacherContext.Teachers.ToListAsync();

                Teacher? teacher = teacherList.FirstOrDefault(x => x.fname.ToLower().Trim() == data?.fname.ToLower().Trim() &&
                                                                x?.lname.ToLower().Trim() == data?.lname.ToLower().Trim() &&
                                                                x?.login.ToLower().Trim() == data?.login.ToLower().Trim() &&
                                                                x?.password == data?.password);

                if (teacher is null)
                {
                    var response = new
                    {
                        status = false,
                        text = "Пользователь не найден"
                    };

                    return Json(response);
                }

                string username = String.Format("{0} {1} {2}", teacher?.lname.Trim(), teacher?.fname.Trim(), teacher?.pname.Trim());
                TokenSecurity tokenSecurity = new TokenSecurity(_jwtSettings, username);
                string tokenHandler = tokenSecurity.GetToken();

                var dataAnswer = new
                {
                    status = true,
                    accessTokenTeacher = tokenHandler,
                    username = tokenSecurity._claimsCreator.GetClaims().Name,
                    login = teacher?.login.Trim(),
                    id = teacher.id
                };

                return Json(dataAnswer);
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return Json("Ошибка на сервере");
            }
        }

        [HttpGet]
        [Authorize]
        public void TeacherPage()
        {
            Console.WriteLine("TeacherPage");
        }

        [HttpGet]
        [Authorize]
        public void DetectAuth()
        {
            try
            {
                TokenSecurity tokenSecurity = new TokenSecurity(_jwtSettings);
                string tokenHandler = tokenSecurity.GetToken();

                Console.WriteLine(tokenHandler);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
    }
}
