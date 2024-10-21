using System;
using System.Collections.Generic;

namespace DDDSample1.Domain.Shared
{
    public class MedicalRecordNumber : IValueObject
    {
        public string number { get; private set; }

        private static int sequentialNumber = 0; // Static variable to keep track of the sequential number

        public MedicalRecordNumber()
        {
            this.number = GenerateMedicalRecordNumber(DateTime.Now);
        }

        private string GenerateMedicalRecordNumber(DateTime registrationDate)
        {
            // Format the year and month
            string year = registrationDate.ToString("yyyy");
            string month = registrationDate.ToString("MM");

    
            sequentialNumber++;

            // Format the sequential number to six digits
            string formattedSequentialNumber = sequentialNumber.ToString("D6");

     
            return $"{year}{month}{formattedSequentialNumber}";
        }

        IEnumerable<object> IValueObject.GetEqualityComponents()
        {
            yield return number;
        }
    }
}