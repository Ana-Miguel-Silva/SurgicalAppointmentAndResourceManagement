using DDDSample1.Domain.Users;
using DDDSample1.Infrastructure.Shared;

namespace DDDSample1.Infrastructure.Users
{
    public class UserRepository : BaseRepository<User, UserId>, IUserRepository
    {
    
        public UserRepository(DDDSample1DbContext context):base(context.Users)
        {
           
        }


    }
}