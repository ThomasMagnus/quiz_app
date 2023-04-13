using Quizer.Models;

namespace Quizer.HelperInterfaces
{
    public interface ITeacherPropsHelper
    {
        public Dictionary<string, string[]> GetTeacherProps();
        public void DeleteSubject(string props, int teacherId);
        public void DeleteGroup(string groupName, string subjectName, int teacherId);
    }
}
