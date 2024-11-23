using System;
using System.Collections.Generic;
using Moq;
using Xunit;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Tests.Domain.Users
{
    public class UserTests
    {
        [Fact]
        public void WhenInstantiatingUser_WithValidParameters_ThenIsCreatedSuccessfully()
        {
            var email = new Email("user@gmail.com");
            var name = "user";
            var role = "ADMIN";

            var User = new User(name, email, role);

            Assert.NotNull(User);
            Assert.Equal(name, User.Username);
            Assert.Equal(email, User.Email);
            Assert.Equal(role, User.Role);
            Assert.True(User.Active);
        }



        [Fact]
        public void WhenUsername_OnActiveUser_ThenUpdatesSuccessfully()
        {
            var email = new Email("user@gmail.com");
            var name = "user";
            var role = "ADMIN";

            var User = new User(name, email, role);

            var newEmail = new Email("user2@gmail.com");

            User.ChangeEmail(newEmail);

            Assert.Equal(newEmail, User.Email);
        }

    

        [Fact]
        public void WhenEmail_OnActiveUser_ThenUpdatesSuccessfully()
        {
            var email = new Email("user@gmail.com");
            var name = "user";
            var role = "ADMIN";

            var User = new User(name, email, role);
           
            var newEmail =  new Email("user2@gmail.com");           

            User.ChangeEmail(newEmail);

            Assert.Equal(newEmail, User.Email);
        }


        [Fact]
        public void WhenMarkingAsInactive_ThenIsInactive()
        {
            var email = new Email("user@gmail.com");
            var name = "user";
            var role = "ADMIN";

            var User = new User(name, email, role);

            User.MarkAsInative();

            Assert.False(User.Active);
        }


        [Fact]
        public void WhenChangingName_WithValidName_ThenUpdatesSuccessfully()
        {
           var email = new Email("user@gmail.com");
           var name = "user";
           var role = "ADMIN";

           var User = new User(name, email, role);

           var newName = "teste";

           User.ChangeUsername(newName);

           Assert.Equal(newName, User.Username);
        }

        [Fact]
        public void WhenSetUpPassword_ThenUserIsValid()
        {
           var email = new Email("user@gmail.com");
           var name = "user";
           var role = "ADMIN";

           var User = new User(name, email, role);
           var password = "#Password1";

           User.SetPassword(password);

           Assert.True(User.Active);
        }
    }
}