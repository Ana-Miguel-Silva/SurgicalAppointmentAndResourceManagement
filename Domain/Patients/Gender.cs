using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
  public static class Gender 
    {
      public const string FEMALE = "FEMALE";
      public const string MALE = "MALE";

      

      public static string[] Genders()
      {
          return [FEMALE, MALE];
      }

      public static bool IsValid(string Status)
      {
          return Genders().Contains(Status);
      } 
    }
}