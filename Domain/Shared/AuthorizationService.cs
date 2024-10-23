using System.Reflection.Metadata;
using DDDSample1.Domain.Users;
using Microsoft.Extensions.Options;
using Microsoft.VisualBasic;

namespace DDDSample1.Domain.Shared;

public class AuthorizationService
{

    /* private readonly IUnitOfWork _unitOfWork;
     private readonly IUserRepository _repo;
     private readonly JwtSettings _jwtSettings;
     */

    private readonly UserService _service;

    public AuthorizationService(UserService service)
    {
        _service = service;
    }


    public async Task<User> ValidateTokenAsync(string authorizationHeader)
    {
        if (string.IsNullOrEmpty(authorizationHeader) || !authorizationHeader.StartsWith("Bearer "))
        {
            throw new UnauthorizedAccessException("Authorization header is missing or invalid.");
        }

        var token = authorizationHeader.Substring("Bearer ".Length).Trim();
        var user = await _service.ValidateTokenAndGetUser(token);

        if (user == null)
        {
            throw new UnauthorizedAccessException("Invalid token.");
        }

        return user;
    }

    public async Task<bool> ValidateUserRole(string authorizationHeader, List<string> Role)
    {
        User user;
        try
        {
            user = await ValidateTokenAsync(authorizationHeader);
        }
        catch (UnauthorizedAccessException)
        {
            return false;
        }

        bool isAuthoraze = await ValidateUserRole(user, Role);

        return isAuthoraze;
    }

    public async Task<bool> ValidateUserRole(User User, List<string> Role)
    {
        return Role.Contains(User.Role.ToUpper());
    }

   
}