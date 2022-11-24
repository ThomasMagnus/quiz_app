using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.InteropServices;
using Microsoft.EntityFrameworkCore;
using Quizer.Context;
using Quizer.HelperInterfaces;

namespace Quizer.Models
{
    public class Tasks
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int id { get; set; }
        public string? filepath { get; set; }
        public DateTime? putdate { get; set; }
        public int? subjectid { get; set; }
        [ForeignKey("subjectid")]
        public Subjects subjects { get; set; }
    }

    public class TasksServices : IServices<Tasks>, ISelection<Tasks>
    {
        public ApplicationContext? db { get; set; }

        public async Task AddEntity(Dictionary<string, object> value)
        {
            try
            {
                Tasks task = new Tasks()
                {
                    filepath = value["filePath"].ToString(),
                    putdate = DateTime.Parse(value["putDate"].ToString()),
                    subjectid = int.Parse(value["subjectId"].ToString())
                };

                await db.tasks.AddAsync(task);
                await db.SaveChangesAsync();

                Console.WriteLine("Задание добавлено!");
            }
            catch
            {
                Console.WriteLine("Вы что-то не ввели!");
            }
        }

        async public Task<List<Tasks>> EntityLIst() => await db.tasks.ToListAsync();

        public IEnumerable<Tasks> GetEntity() => db.tasks.Select(x => x);

        public async Task<Tasks?> GetEntity(Dictionary<string, object> value)
        {
            if (value.ContainsKey("subjectsId")) { return await db.tasks.FirstOrDefaultAsync(x => x.subjectid == int.Parse(value["subjectsId"].ToString())); }
            throw new Exception("Предмет не найден");
        }

        public dynamic SelectionValues(Dictionary<string, object> value)
        {
            try
            {
                return db.tasks.Where(x => x.id == int.Parse(value["subjectId"].ToString()));
            }
            catch
            {
                return "Предмет не найден";
            }
        }
    }
}
