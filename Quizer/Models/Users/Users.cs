namespace Quizer.Models;

public class Users
{
    public int? Id { get; set; }
    public string? Firstname { get; set; }
    public string? Lastname { get; set; }
    public string? Password { get; set; }
    public int? GroupsId { get; set; }
    public Groups.Groups? Groups { get; set; }
}