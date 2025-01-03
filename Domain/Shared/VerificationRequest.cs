using System.Globalization;

namespace DDDSample1.Domain.Shared
{ 
    public class VerificationRequest  
    {
        public string Email { get; set; } 
        public string Code { get; set; }

        public VerificationRequest( string email, string code){
            this.Email = email;
            this.Code = code;
        }

      
    }
}