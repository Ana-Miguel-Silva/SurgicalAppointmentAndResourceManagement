using System;


namespace DDDSample1.Domain.Users
{
    public class JwtSettings

  {

      public string Secret { get; set; }

      public string Issuer { get; set; }

      public string Audience { get; set; }

      public int TokenExpiryInMinutes { get; set; }

  }
}