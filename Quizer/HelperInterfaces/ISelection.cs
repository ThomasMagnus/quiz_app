namespace Quizer.HelperInterfaces
{
    public interface ISelection<T> where T : class
    {
        public dynamic SelectionValues(Dictionary<string, object> value);
    }
}
