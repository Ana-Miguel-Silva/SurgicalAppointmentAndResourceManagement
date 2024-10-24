
namespace DDDSample1.Domain.Shared
{
  public class PasswordRequest
  {
      
      public string Password { get; set; }

      public string Username { get; set; }

      public PasswordRequest( string username, string pass){
        this.Username = username;
        this.Password = pass;
      }
  }
}