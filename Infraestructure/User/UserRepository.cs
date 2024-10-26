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

        public async Task<User> GetAdminUserAsync()
        {
            var users = await GetAllAsync();
            return users.FirstOrDefault(user => user.Role == "Admin");
        }

        public async Task<User> GeBbyEmailAsync(string email)
        {
            return await _context.Users
        .FirstOrDefaultAsync(u => u.Email.FullEmail == email);
        }
    }
}