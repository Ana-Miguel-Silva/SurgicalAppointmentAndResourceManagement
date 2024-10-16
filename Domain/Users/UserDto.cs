using System;

namespace DDDSample1.Domain.Users
{
    public class UserDto
    {
        public Guid Id { get; set; }

        public string Username { get;  set; }

        public string email { get;  set; }

         public string role { get;  set; }


    }
}