using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Quizer.HelperClasses;
using Quizer.Models;
using Quizer.Context;
using System;

namespace Quizer.Controllers
{
    public class TeacherController : Controller
    {
        private readonly JwtSettings? _jwtSettings;
        private readonly ILogger<TeacherController> _logger;

        public TeacherController(IOptions<JwtSettings> jwtSettings, ILogger<TeacherController> logger) => (_jwtSettings, _logger) = (jwtSettings.Value, logger);

        [HttpPost, Route("Teacher/Index")]
        public async Task<IActionResult> Index()
        {
            try
            {
                Teacher? data = await HttpContext.Request.ReadFromJsonAsync<Teacher>();

                using TeacherContext teacherContext = new();

                List<Teacher> teacherList = await teacherContext.Teachers.ToListAsync();

                Teacher? teacher = teacherList.FirstOrDefault(x => x?.fname?.ToLower().Trim() == data?.fname?.ToLower().Trim() &&
                                                                x?.lname?.ToLower().Trim() == data?.lname?.ToLower().Trim() &&
                                                                x?.login?.ToLower().Trim() == data?.login?.ToLower().Trim() &&
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

                string username = String.Format("{0} {1} {2}", teacher?.lname?.Trim(), teacher?.fname?.Trim(), teacher?.pname?.Trim());
                TokenSecurity tokenSecurity = new(_jwtSettings, username);
                string tokenHandler = tokenSecurity.GetToken();

                Dictionary<string, List<string>> teacherProps = GetTeacherProps(teacher.id);
                GetTeacherProps(teacher.id);

                var dataAnswer = new
                {
                    status = true,
                    accessTokenTeacher = tokenHandler,
                    username = tokenSecurity._claimsCreator.GetClaims().Name,
                    login = teacher?.login?.Trim(),
                    id = teacher?.id,
                    props = teacherProps
                };

                Sessions.CreateSession(teacher?.id, teacher.fname, teacher?.lname, DateTime.Now);

                return Json(dataAnswer);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.Message);
                return Json("Ошибка на сервере");
            }
        }

        [HttpGet, Route("Teacher/TeacherPage")]
        [Authorize]
        public void TeacherPage()
        {
            Console.WriteLine("TeacherPage");
        }

        [NonAction]
        public Dictionary<string, List<string>> GetTeacherProps(int teacherId)
        {
            Dictionary<string, List<string>> teacherProps = new();

            using TeacherPropsContext teacherPropsContext = new();
            using TeacherContext teacherContext = new();
            using SubjectsContext subjectsContext = new();

            List<TeacherProps> teacherPropsList = teacherPropsContext.TeacherProps.Where(x => x.teacherid == teacherId).ToList();
            List<Subjects>? subjectsList = subjectsContext?.subjects?.ToList();
            List<Groups> groupsList = new GroupsServices() { db = new ApplicationContext() }.EntityLIst().Result;

            List<string>? subjects = new();
            List<string>? groups = new();

            //List<Dictionary<string, List<string>>> resultLst = new List<Dictionary<string, List<string>>>();

            //foreach (var item in teacherPropsList)
            //{
            //    if (!teacherProps.ContainsKey(groupsList.FirstOrDefault(x => x.Id == item.subjectsid).Name))
            //    {
            //        teacherProps[groupsList.FirstOrDefault(x => x.Id == item.subjectsid).Name] = subjectsList.Where(x => x.Id == item.id).ToArray()
            //    }
            //}

            //foreach (var item in teacherPropsList)
            //{
            //    resultLst.Add(new List<string>() { subjectsList?.FirstOrDefault(x => x.Id == item.subjectsid)?.Name,
            //        groupsList.FirstOrDefault(x => x.Id == item.groupsid)?.Name, item.id.ToString()});
            //}

            foreach (TeacherProps? item in teacherPropsList)
            {
                subjects.Add(subjectsList.Where(x => x.Id == item.subjectsid).Select(x => x.Name).First());
                groups.Add(groupsList.Where(x => x.Id == item.groupsid).Select(x => x.Name).First());
            }

            teacherProps.Add("subjects", subjects.Distinct().ToList());
            teacherProps.Add("groups", groups.Distinct().ToList());


            return teacherProps;
        }

        
    }
}
