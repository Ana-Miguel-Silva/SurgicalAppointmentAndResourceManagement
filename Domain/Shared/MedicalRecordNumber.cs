using System;
using System.Collections.Generic;

namespace DDDSample1.Domain.Shared
{
    public class MedicalRecordNumber : EntityId
    {
        public string number { get; private set; }

        private static int sequentialNumber = 0; // Static variable to keep track of the sequential number

        public MedicalRecordNumber() : base(GenerateMedicalRecordNumber(DateTime.Now))
        
        {
            this.number = GenerateMedicalRecordNumber(DateTime.Now);
        }

         public MedicalRecordNumber(string number) : base(number)
        {
            this.number = number;
        }


        private  static string GenerateMedicalRecordNumber(DateTime registrationDate)
        {
            // Format the year and month
            string year = registrationDate.ToString("yyyy");
            string month = registrationDate.ToString("MM");

    
            sequentialNumber++;

            // Format the sequential number to six digits
            string formattedSequentialNumber = sequentialNumber.ToString("D6");

     
            return $"{year}{month}{formattedSequentialNumber}";
        }


        protected override object createFromString(string text)
        {
            return text;
        }

        public override string AsString()
        {
            return this.number;  // Return the medical record number as a string.
        }

    }
}