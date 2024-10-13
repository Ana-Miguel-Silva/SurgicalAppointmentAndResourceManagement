namespace DDDSample1.Domain.Users
{
    public class CreatingUserDto
    {
         public string Username { get;  set; }

        public string email { get;  set; }


        public CreatingUserDto(string email, string username)
        {
            this.Username = username;
            this.email = email;
        }
    }
}