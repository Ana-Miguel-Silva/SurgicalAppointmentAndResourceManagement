
namespace DDDSample1.Domain.Shared
{
  public class LoginRequest
  {
      public string Username { get; set; }
      public string Password { get; set; }

      public LoginRequest(string username, string password){
        this.Username = username;
        this.Password = password;
      }
  }
}