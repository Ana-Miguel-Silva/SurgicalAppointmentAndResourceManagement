using System.Globalization;

namespace DDDSample1.Domain.Shared
{
    public class Slot : IValueObject
    {
        public DateTime StartTime { get; private set; }
        public DateTime EndTime { get; private set; }


        public Slot(DateTime start, DateTime end) {
            StartTime = start;
            EndTime = end;
        }
        public Slot(string start, string end) {
            StartTime = DateTime.Parse(start);
            EndTime = DateTime.Parse(end);
        }

        public TimeSpan timespan(){
            return EndTime - StartTime;
        }

        public IEnumerable<object> GetEqualityComponents()
        {
            yield return StartTime;
            yield return EndTime;
        }
    }
}