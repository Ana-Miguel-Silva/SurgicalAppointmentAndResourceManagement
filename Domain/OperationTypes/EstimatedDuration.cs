using System;
using System.Collections.Generic;

namespace DDDSample1.Domain.Shared
{
    public class EstimatedDuration : IValueObject
    {
        public TimeOnly PatientPreparation { get; private set; }
        public TimeOnly Surgery { get; private set; }
        public TimeOnly Cleaning { get; private set; }

        public EstimatedDuration(TimeOnly patientPreparation, TimeOnly surgery, TimeOnly cleaning)
        {
            if (patientPreparation == default || surgery == default || cleaning == default)
                throw new BusinessRuleValidationException("One of the estimated duration parameters was not valid.");

            PatientPreparation = patientPreparation;
            Surgery = surgery;
            Cleaning = cleaning;
        }

        public TimeOnly GetTotalDuration()
        {
            TimeSpan totalDuration = PatientPreparation.ToTimeSpan() + Surgery.ToTimeSpan() + Cleaning.ToTimeSpan();
            return TimeOnly.FromTimeSpan(totalDuration);
        }

        public IEnumerable<object> GetEqualityComponents()
        {
            yield return PatientPreparation;
            yield return Surgery;
            yield return Cleaning;
        }
    }
}