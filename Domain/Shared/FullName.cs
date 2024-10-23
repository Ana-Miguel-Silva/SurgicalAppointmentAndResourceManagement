using System;
using System.Collections.Generic;


namespace DDDSample1.Domain.Shared;

public class FullName : IValueObject
{
    public string FirstName  { get; private set; }

    public string MiddleNames  { get; private set; }

    public string LastName  { get; private set; }

    public FullName(string name){
      string[] names = name.Split(' ');
      
      this.FirstName = names[0];
      this.LastName = names[names.Length-1];

      if (names.Length > 2) {
          this.MiddleNames = string.Join(" ", names.Skip(1).Take(names.Length - 2));
      } else {
          this.MiddleNames = "";
      }
    }

    public FullName(){
        
    }

    public FullName(string first, string middle, string last)
    {
        this.FirstName = first;
        this.MiddleNames = middle;
        this.LastName = last;

    }

    public string getFull(){
        return string.Join(FirstName, MiddleNames, LastName);
    }


    IEnumerable<object> IValueObject.GetEqualityComponents()
    {
       yield return FirstName;
       yield return MiddleNames;
       yield return LastName;
    }

    public string toName(){

        return this.FirstName + " " + this.MiddleNames + " " + this.LastName;
    }
}