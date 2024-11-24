using DDDSample1.Domain.Staff;

namespace DDDSample1.Domain.Shared
{
    public class AppointmentPlaningModuleHelper
        {
            public int Start { get; set; }
            public int End { get; set; }
            public List<StaffHelper> Staff { get; set; } = new List<StaffHelper>();
        }
}