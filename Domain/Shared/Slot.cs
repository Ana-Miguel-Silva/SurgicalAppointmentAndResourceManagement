namespace DDDSample1.Domain.Shared
{
    public class Slot : IValueObject
    {
        public DateOnly StartDate { get; private set; }
        public DateOnly EndDate { get; private set; }
        public TimeSpan StartTime { get; private set; }
        public TimeSpan EndTime { get; private set; }

        public Slot(DateOnly startDate, DateOnly endDate, TimeSpan startTime, TimeSpan endTime)
        {
            StartDate = startDate;
            EndDate = endDate;
            StartTime = startTime;
            EndTime = endTime;
        }

        public IEnumerable<object> GetEqualityComponents()
        {
            yield return StartDate;
            yield return EndDate;
            yield return StartTime;
            yield return EndTime;
        }
    }
}