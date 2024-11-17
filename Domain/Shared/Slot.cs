using System.Globalization;

namespace DDDSample1.Domain.Shared
{
    public class Slot : IValueObject
    {
        public DateTime StartTime { get; private set; }
        public DateTime EndTime { get; private set; }

  private Slot() { }

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

        // Override Equals
        public override bool Equals(object obj)
        {
            return Equals(obj as Slot);
        }

        // Implement IEquatable<Slot>
        public bool Equals(Slot other)
        {
            if (other == null) return false;

            return StartTime == other.StartTime && EndTime == other.EndTime;
        }

        // Override GetHashCode
        public override int GetHashCode()
        {
            return HashCode.Combine(StartTime, EndTime);
        }
    }
}