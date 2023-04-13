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
        public int Id { get; set; }
        public string? Filepath { get; set; }
        public DateTime? Putdate { get; set; }
        public int? SubjectId { get; set; }
        [ForeignKey("subjectid")]
        public Subjects? Subjects { get; set; }
        public string? Filename { get; set; }
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
                    Filepath = value["filePath"].ToString(),
                    Putdate = DateTime.Parse(value["putDate"]?.ToString()!),
                    SubjectId = int.Parse(value["subjectId"]?.ToString()!),
                    Filename = new FileInfo(value["filePath"]?.ToString()!).Name,
                };

                await db!.Tasks.AddAsync(task);
                await db.SaveChangesAsync();

                Console.WriteLine("Задание добавлено!");
            }
            catch
            {
                Console.WriteLine("Вы что-то не ввели!");
            }
        }

        async public Task<List<Tasks>> EntityLIst(ApplicationContext db) => await db.Tasks.ToListAsync();

        public Task<List<Tasks>> EntityLIst()
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Tasks> GetEntity() => db!.Tasks.Select(x => x);

        public async Task<Tasks?> GetEntity(Dictionary<string, object> value)
        {
            if (value.ContainsKey("subjectId")) { return await db!.Tasks.FirstOrDefaultAsync(x => x.SubjectId == int.Parse(value["subjectId"].ToString()!)); }
            throw new Exception("Предмет не найден");
        }

        public List<Tasks> SelectionValues(Dictionary<string, object>? value)
        {
            try { return db!.Tasks.Where(x => x.SubjectId == int.Parse(value!["subjectId"].ToString()!)).ToList(); }
            catch { return null!; }
        }
    }
}
