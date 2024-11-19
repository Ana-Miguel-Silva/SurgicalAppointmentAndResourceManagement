using DDDSample1.Domain.Staff;

namespace DDDSample1.Domain.Shared
{
    public class AppointmentSlot : IValueObject
    {
        public Slot AppointmentTime { get; private set; }
        public StaffGuid Staff { get; private set; }
  private AppointmentSlot() { }

        public AppointmentSlot(Slot time, StaffGuid staff) {
            this.AppointmentTime = time;
            this.Staff = staff;
        }

        public IEnumerable<object> GetEqualityComponents()
        {
            yield return AppointmentTime;
            yield return Staff;
        }

        // Override Equals
        public override bool Equals(object obj)
        {
            return Equals(obj as Slot);
        }

        // Implement IEquatable<Slot>
        public bool Equals(AppointmentSlot other)
        {
            if (other == null) return false;

            return AppointmentTime == other.AppointmentTime && Staff == other.Staff;
        }

        // Override GetHashCode
        public override int GetHashCode()
        {
            return HashCode.Combine(AppointmentTime, Staff);
        }
    }
}