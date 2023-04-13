using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Quizer.Models;
using Quizer.HelperClasses;
using System.Text.RegularExpressions;
using Quizer.Context;
using System.Text.Json;

namespace Quizer.Controllers
{
    public class UserPage : Controller
    {
        [HttpGet, Route("[controller]/Index")]
        [Authorize]
        public void Index()
        {
            Console.WriteLine(DateTime.Now);
            Console.WriteLine(UserProperty.firstname);
            RedirectToAction("UserData", "UserPage");
        }

        public IActionResult UserData()
        {
            return Json("Hello, user!");
        }

        [HttpGet]
        public IActionResult GetSubjects()
        {
            Console.WriteLine(UserProperty.firstname);
            Console.WriteLine(UserProperty.group);
            using SubjectsContext subjectsContext = new();
            try
            {
                List<Subjects>? subjects = subjectsContext?.subjects?.ToList();
                return Json(subjects);
            }
            catch (Exception ex)
            {
                Console.Write(ex);
                return Json("Ошибка запроса");
            }
        }

        [HttpPost]
        public IActionResult GetUserProps([FromBody] JsonElement value)
        {
            using (SessionsContext sessionContext = new())
            using (ApplicationContext applicationContext = new())

            try
            {

                List<Sessions>? sessions = sessionContext?.Sessions?.ToList();
                Sessions? session = sessions?.FirstOrDefault(x => x.Id == 3);
                GroupsServices groupsServices = new() { db = applicationContext };

                string? groupName = session?.User?.Groups?.Name;
                Console.WriteLine(groupName);

                var userProperty = new
                {
                    firstname = session?.UserFirstname,
                    lastname = session?.UserLastname,
                    group = groupName,
                    id = session?.Id
                };

                return Json(userProperty);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return Json(ex);
            }
        }

        public IActionResult GetTasks()
        {
            try
            {
                using ApplicationContext applicationContext = new();
                TasksServices tasksServices = new TasksServices() { db = applicationContext };

                List<Tasks>? tasks = tasksServices?.SelectionValues(new Dictionary<string, object>()
                {
                    {"subjectId", 1},
                })?.OrderByDescending(x => x?.Putdate)?.ToList();

                return Json(tasks);
                //return Json("Запрос успешно прошёл");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Ошибка в Tasks");
                Console.WriteLine(ex.ToString());
                return Json("Произошла ошибка в запросе Tasks");
            }
        }

    }
}
