using DDDSample1.Domain.Staff;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Appointments
{
    public class AppointmentSlot : IValueObject
    {
        public Slot AppointmentTime { get; private set; }
        public StaffGuid Staff { get; private set; }

        private AppointmentSlot() { }

        public AppointmentSlot(Slot time, StaffGuid staff)
        {
            this.AppointmentTime = time;
            this.Staff = staff;
        }

        public IEnumerable<object> GetEqualityComponents()
        {
            yield return AppointmentTime;
            yield return Staff;
        }

        // Correctly override Equals
        public override bool Equals(object obj)
        {
            return Equals(obj as AppointmentSlot);  // Compare with AppointmentSlot
        }

        // Implement IEquatable<AppointmentSlot>
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
