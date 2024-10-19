
namespace DDDSample1.Domain.Shared
{
  public class PasswordRequest
  {
      public string Token { get; set; }
      public string Password { get; set; }

      public PasswordRequest(string token, string pass){
        this.Token = token;
        this.Password = pass;
      }
  }
}