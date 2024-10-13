using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Users
{
    public class User : Entity<UserId>, IAggregateRoot
    {
     
        public string Username { get;  private set; }

        public string email { get;  private set; }



        public User(string username, string email)
        {
            this.Id = new UserId(Guid.NewGuid());
            this.Username = username;
            this.email = email;
        }
        public void ChangeEmail(string email)
        {
            this.email = email;
        }
       
    }
}