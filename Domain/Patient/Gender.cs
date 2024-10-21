using System;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Patient;

namespace DDDSample1.Domain.Patient
{
  public static class Gender
    {
      public const string FEMININO = "FEMININO";
      public const string MASCULINO = "MASCULINO";

      

      public static string[] Genders()
      {
          return [FEMININO, MASCULINO];
      }

      public static bool IsValid(string Status)
      {
          return Genders().Contains(Status);
      } 
    }
}