using System;
using Xunit;
using DDDSample1.Domain.Shared;

namespace Domain.Tests
{
    public class MedicalRecordNumberTests
    {
        [Fact]
        public void Constructor_GeneratesUniqueMedicalRecordNumber()
        {
            // Arrange
            var registrationDate = DateTime.Now;

            // Act
            var medicalRecordNumber1 = new MedicalRecordNumber();
            var medicalRecordNumber2 = new MedicalRecordNumber();

            // Assert
            Assert.NotEqual(medicalRecordNumber1.number, medicalRecordNumber2.number);
        }

        [Fact]
        public void Constructor_InitializesWithGivenNumber()
        {
            // Arrange
            var expectedNumber = "202310000001"; // Example format: YearMonthSequential
            var medicalRecordNumber = new MedicalRecordNumber(expectedNumber);

            // Act
            var actualNumber = medicalRecordNumber.number;

            // Assert
            Assert.Equal(expectedNumber, actualNumber);
        }

        [Fact]
        public void GenerateMedicalRecordNumber_FormatsCorrectly()
        {
            // Arrange
            var registrationDate = new DateTime(2024, 12, 1);
            var medicalRecordNumber = new MedicalRecordNumber();

            // Act
            var generatedNumber = medicalRecordNumber.number; // Call after instantiation to get the generated number

            // Extract expected parts
            var yearMonth = registrationDate.ToString("yyyyMM");
            var sequentialPart = medicalRecordNumber.number.Substring(6); // Get the last six digits

            // Assert
            Assert.StartsWith(yearMonth, generatedNumber);
            Assert.Equal(6, sequentialPart.Length);
        }

        [Fact]
        public void MultipleMedicalRecordNumbers_GenerateUniqueNumbers()
        {
            // Arrange
            var recordNumbers = new MedicalRecordNumber[10];

            // Act
            for (int i = 0; i < 10; i++)
            {
                recordNumbers[i] = new MedicalRecordNumber();
            }

            // Assert
            for (int i = 0; i < recordNumbers.Length - 1; i++)
            {
                for (int j = i + 1; j < recordNumbers.Length; j++)
                {
                    Assert.NotEqual(recordNumbers[i].number, recordNumbers[j].number);
                }
            }
        }
    }
}
