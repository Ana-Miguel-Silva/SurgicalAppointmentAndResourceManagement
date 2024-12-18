using DDDSample1.Domain.Staff;
using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.OperationTypes;

namespace DDDSample1.Domain.Appointments
{
    public class PrologUtils
    {

        public PrologUtils()
        {
        }

        public List<StaffToProlog> getPrologStaffList(List<StaffProfile> staff, DateTime date)
        {
            List<StaffToProlog> prologStaff = new List<StaffToProlog>();

            foreach (var sta in staff)
            {
                List<int> slots = new List<int>();

                foreach (var slot in sta.AvailabilitySlots)
                {
                    if (slot.StartTime.Day == date.Day && slot.StartTime.Month == date.Month && slot.StartTime.Year == date.Year)
                    {
                        slots.Add(slot.StartTime.Hour * 60 + slot.StartTime.Minute);
                        slots.Add(slot.EndTime.Hour * 60 + slot.EndTime.Minute);
                    }
                }

                if (slots.Count != 0)
                    prologStaff.Add(new StaffToProlog(sta.Id.Value, sta.Role, sta.Specialization, slots));
            }

            return prologStaff;
        }

        public List<RoomToProlog> getPrologRoomsList(List<SurgeryRoom> rooms, List<Appointment> appointments, DateTime date)
        {
            List<RoomToProlog> prologRooms = new List<RoomToProlog>();

            foreach (var room in rooms)
            {
                List<int> slots = new List<int>();

                foreach (var slot in room.MaintenanceSlots)
                {
                    if (slot.StartTime.Date == date.Date)
                    {
                        slots.Add(slot.StartTime.Hour * 60 + slot.StartTime.Minute);
                        slots.Add(slot.EndTime.Hour * 60 + slot.EndTime.Minute);
                    }
                }

                foreach (var app in appointments)
                {
                    if (app.RoomId == room.Id || app.Date.StartTime.Date == date.Date)
                    {
                        slots.Add(app.Date.StartTime.Hour * 60 + app.Date.StartTime.Minute);
                        slots.Add(app.Date.EndTime.Hour * 60 + app.Date.EndTime.Minute);
                    }
                }

                prologRooms.Add(new RoomToProlog(room.Id.Value, slots));
            }
            return prologRooms;
        }

        public List<RequestToProlog> getPrologRequestList(List<OperationRequest> requests)
        {
            List<RequestToProlog> prologRequests = new List<RequestToProlog>();

            foreach (var req in requests)
            {
                if (req.Active)
                    prologRequests.Add(new RequestToProlog(req.Id.Value, req.OperationTypeId.Value));
            }

            return prologRequests;
        }

        public (List<OperationTypeToProlog>, List<RequiredStaffToProlog>) GeneratePrologData(List<OperationType> types)
        {
            List<OperationTypeToProlog> prologTypes = new List<OperationTypeToProlog>();
            List<RequiredStaffToProlog> prologRequiredStaff = new List<RequiredStaffToProlog>();

            foreach (var type in types)
            {
                var anesthesia = type.EstimatedDuration.PatientPreparation.Minute + type.EstimatedDuration.PatientPreparation.Hour * 60;
                var surgery = type.EstimatedDuration.Surgery.Minute + type.EstimatedDuration.Surgery.Hour * 60;
                var cleaning = type.EstimatedDuration.Cleaning.Minute + type.EstimatedDuration.Cleaning.Hour * 60;

                prologTypes.Add(new OperationTypeToProlog(type.Id.Value, anesthesia, surgery, cleaning));

                foreach (var staff in type.RequiredStaff)
                {
                    prologRequiredStaff.Add(new RequiredStaffToProlog(type.Id.Value, staff.Quantity, staff.Specialization, staff.Role));
                }
            }

            return (prologTypes, prologRequiredStaff);
        }
    }

}