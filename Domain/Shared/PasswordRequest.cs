
namespace DDDSample1.Domain.Shared
{
  public class PasswordRequest
  {
      
      public string Password { get; set; }

      public PasswordRequest( string pass){
        this.Password = pass;
      }
  }
}