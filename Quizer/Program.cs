using System.Text;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.AspNetCore.HttpLogging;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Quizer.Models;
using Microsoft.AspNetCore.Authorization;
using Quizer.HelperClasses;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.AddFile(Path.Combine(Directory.GetCurrentDirectory(), "logget.txt"));

builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));

string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins, policy =>
    {
        policy.WithOrigins("https://localhost:44491").AllowAnyHeader().AllowAnyMethod();
    });
});

builder.Services.AddControllersWithViews();
builder.Services.AddMvc();

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration.GetSection("JwtSettings:Issuer").Value,

            ValidateAudience = true,
            ValidAudience = builder.Configuration.GetSection("JwtSettings:Audience").Value,

            ValidateLifetime = true,

            IssuerSigningKey =
                new SymmetricSecurityKey(
                        Encoding.ASCII.GetBytes(s: builder.Configuration?.GetSection("JwtSettings:SecretKey").Value)
                    ),

            ValidateIssuerSigningKey = true
        };
    });
    

builder.Services.AddAuthorization();
builder.Services.AddSession();
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseStaticFiles();
app.UseMiddleware<AuthorizationMiddleware>();
app.UseRouting();
app.UseCors(MyAllowSpecificOrigins);
app.UseHttpLogging();

app.MapControllerRoute(name: "UserPageConnect", pattern: "{controller=UserPage}/{action=Index}");
app.MapControllerRoute(name: "AdminAction", pattern:"{controller=Admin}/{action=Index}");
app.MapControllerRoute(name: "AdminPage", pattern: "{controller=AdminPage}/{action=Index}");
app.MapControllerRoute(name: "GetSubjects", pattern: "{controller=UserPage}/{action=GetSubjects}");
app.MapControllerRoute(name: "DetectToken", pattern: "{controller=Authorization}/{action=DetectToken}");
app.MapControllerRoute(name: "DetectAuthTeacher", pattern: "{controller=Teacher}/{action=DetectAuth}");


app.MapFallbackToFile("index.html");

app.UseCookiePolicy(new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.Strict,
    HttpOnly = HttpOnlyPolicy.Always,
    // При включении HTTPS нужно вернуть CookieSecurePolicy.Always
    Secure = CookieSecurePolicy.None,
});
app.UseSession();

app.UseAuthentication();
app.UseAuthorization();

app.Run();
