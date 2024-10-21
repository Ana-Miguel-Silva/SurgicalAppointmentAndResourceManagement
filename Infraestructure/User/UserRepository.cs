using DDDSample1.Domain.Users;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDSample1.Infrastructure.Users
{
    public class UserRepository : BaseRepository<User, UserId>, IUserRepository
    {
        private readonly DDDSample1DbContext _context;
    
        public UserRepository(DDDSample1DbContext context):base(context.Users)
        {
            _context = context;
        }

        public async Task<List<User>> GetByUsernameAsync(string username)
        {
            return await _context.Users
                .Where(u => u.Username.Contains(username))
                .ToListAsync();
        }
    }
}