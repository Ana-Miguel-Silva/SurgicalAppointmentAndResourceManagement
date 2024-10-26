
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Users
{
    public interface IUserRepository : IRepository<User, UserId>
    {
        Task<List<User>> GetByUsernameAsync(string username);

        Task<User> GetAdminUserAsync();

        Task<User> GeBbyEmailAsync(string email);
    }
}