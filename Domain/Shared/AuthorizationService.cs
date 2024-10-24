using System.IdentityModel.Tokens.Jwt;
using System.Reflection.Metadata;
using DDDSample1.Domain.Users;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualBasic;
using DDDSample1.Domain.Shared;
using System.Security.Claims;
using System.Text;


namespace DDDSample1.Domain.Shared;

public class AuthorizationService
{

    /* private readonly IUnitOfWork _unitOfWork;
     private readonly IUserRepository _repo;
     private readonly JwtSettings _jwtSettings;
     */



    private readonly IUserRepository _repo;

    private readonly JwtSettings _jwtSettings;

    public AuthorizationService(IUserRepository userRepository, IOptions<JwtSettings> jwtSettings)
    {
        _repo = userRepository;
        _jwtSettings = jwtSettings.Value;
    }

    public string GenerateToken(UserDto user)
    {
        // Define the issuer and audience
        var issuer = _jwtSettings.Issuer;
        var audience = _jwtSettings.Audience;

        // Set the current time and expiration time
        DateTime now = DateTime.UtcNow;
        DateTime expirationTime = now.AddMinutes(_jwtSettings.TokenExpiryInMinutes);

        // Create the claims
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role)
        };

        // Create the JWT header
        var jwtHeader = new JwtHeader(new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret)),
            SecurityAlgorithms.HmacSha256));

        // Create the JWT payload
        var jwtPayload = new JwtPayload
        {
            { "iss", issuer },
            { "aud", audience },
            { "iat", new DateTimeOffset(now).ToUnixTimeSeconds() }, // Issued at
            { "exp", new DateTimeOffset(expirationTime).ToUnixTimeSeconds() }, // Expiration time
        };

        // Add claims to the payload
        foreach (var claim in claims)
        {
            jwtPayload.Add(claim.Type, claim.Value);
        }

        // Create the JWT token
        var jwtToken = new JwtSecurityToken(jwtHeader, jwtPayload);

        // Return the serialized token
        return new JwtSecurityTokenHandler().WriteToken(jwtToken);
    }


    public async Task<User> GetUserFromToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        try
        {
            var claimsPrincipal = tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret)),
                ValidateIssuer = true,
                ValidIssuer = _jwtSettings.Issuer,
                ValidateAudience = true,
                ValidAudience = _jwtSettings.Audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.FromMinutes(5)
            }, out var validatedToken);

            var userIdClaim = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                Console.WriteLine("Token is invalid: NameIdentifier claim is missing or not a valid GUID.");
                return null;// Token invalid
            }

            var userRoleClaim = claimsPrincipal.FindFirst(ClaimTypes.Role);
            Console.WriteLine($"{userRoleClaim}");



            var userId2 = Guid.Parse(userIdClaim.Value);
            var userIdObject = new UserId(userId2);

            var user = await _repo.GetByIdAsync(userIdObject);

            Console.WriteLine(user.Id);
            Console.WriteLine(userIdObject);
            return user;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Token validation error: {ex.Message}");
            return null;
        }
    }



    public async Task<User> ValidateTokenAsync(string authorizationHeader)
    {
        if (string.IsNullOrEmpty(authorizationHeader) || !authorizationHeader.StartsWith("Bearer "))
        {
            throw new UnauthorizedAccessException("Authorization header is missing or invalid.");
        }

        var token = authorizationHeader.Substring("Bearer ".Length).Trim();
        var user = await GetUserFromToken(token);

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

    public async Task<string> GetUserEmail(string authorizationHeader)
    {
        User user;
        try
        {
            user = await ValidateTokenAsync(authorizationHeader);
        }
        catch (UnauthorizedAccessException)
        {
            return null;
        }

        return user.Email.ToString();
    }

    public async Task<bool> ValidateUserRole(User User, List<string> Role)
    {
        return Role.Contains(User.Role.ToUpper());
    }


}