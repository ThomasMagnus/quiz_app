namespace Quizer.MiddlewareExt
{
    public delegate void AuthorizeDelegate();
    public class AuthorizationMiddleware
    {
        readonly RequestDelegate next;

        public AuthorizationMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            await next.Invoke(context);
            Console.WriteLine(context.Request.Path);
        }
    }
}
