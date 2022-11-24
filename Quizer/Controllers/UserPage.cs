using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Quizer.Models;
using Quizer.HelperClasses;
using System.Text.RegularExpressions;
using Quizer.Context;

namespace Quizer.Controllers
{
    public class UserPage : Controller
    {
        [HttpGet]
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

        public IActionResult GetUserProps()
        {
            var userProperty = new
            {
                firstname = UserProperty.firstname,
                lastname = UserProperty.lastname,
                group = UserProperty.group,
                id = UserProperty.id
            };

            return Json(userProperty);
        }

        public async Task<IActionResult> GetTasks()
        {
            using ApplicationContext applicationContext = new();
            TasksServices tasksServices = new TasksServices() { db = applicationContext };
            Tasks? task = await tasksServices.GetEntity(new Dictionary<string, object>()
            {
                {"subjectsId", 1},
            });

            return Json(task);
        }

    }
}
