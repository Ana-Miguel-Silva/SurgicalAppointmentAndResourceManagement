using DDDSample1.Domain.Shared;
using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Appointments;
using Newtonsoft.Json;
using System.Text;
using DDDSample1.Domain.Staff;
using Newtonsoft.Json.Linq;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Appointments.Dto;

namespace DDDSample1.ApplicationService.Appointments
{
    public class AppointmentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAppointmentRepository _repo;
        private readonly ISurgeryRoomRepository _repoRooms;
        private readonly IOperationRequestRepository _repoOpReq;
        private readonly IStaffRepository _repoStaff;
        private readonly IOperationTypeRepository _repoOpTy;
        private readonly HttpClient _httpClient;
        public IConfiguration configuration { get; }


        public AppointmentService(IUnitOfWork unitOfWork, IAppointmentRepository repo, ISurgeryRoomRepository repoSurgeryRooms, IOperationRequestRepository repoOperationRequests, IStaffRepository repoStaff, IOperationTypeRepository repoOpTy, IConfiguration configuration)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._repoRooms = repoSurgeryRooms;
            this._repoOpReq = repoOperationRequests;
            _httpClient = new HttpClient();
            this.configuration = configuration;
            this._repoStaff = repoStaff;
            this._repoOpTy = repoOpTy;
        }

        public async Task<List<AppointmentDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();

            List<AppointmentDto> listDto = list.ConvertAll<AppointmentDto>(Appointment =>
                new(Appointment.Id.AsGuid(), Appointment.RoomId, Appointment.OperationRequestId, Appointment.Date, Appointment.AppStatus, Appointment.AppointmentSlot));

            return listDto;
        }

        public async Task<AppointmentDto> GetByIdAsync(AppointmentId id)
        {
            var Appointment = await this._repo.GetByIdAsync(id);

            if (Appointment == null)
                return null;

            return new AppointmentDto(Appointment.Id.AsGuid(), Appointment.RoomId, Appointment.OperationRequestId, Appointment.Date, Appointment.AppStatus, Appointment.AppointmentSlot);
        }

        public async Task<AppointmentDto> AddAsync(CreatingAppointmentDto dto)
        {

            var appointment = new Appointment(dto.RoomId, dto.OperationRequestId, dto.Date, dto.Appstatus, dto.AppointmentSlot);

            await checkRoomIdAsync(dto.RoomId);
            await checkOperationRequestIdAsync(dto.OperationRequestId);

            await this._repo.AddAsync(appointment);

            await this._unitOfWork.CommitAsync();


            return new AppointmentDto(appointment.Id.AsGuid(), appointment.RoomId, appointment.OperationRequestId, appointment.Date, appointment.AppStatus, appointment.AppointmentSlot);
        }

        public async Task<string> PostToPrologServer(string url, object data)
        {
            try
            {

                var json = JsonConvert.SerializeObject(data);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                HttpResponseMessage response = await _httpClient.PostAsync(url, content);
                response.EnsureSuccessStatusCode();

                string responseBody = await response.Content.ReadAsStringAsync();
                return responseBody;
            }
            catch (HttpRequestException e)
            {
                throw new BusinessRuleValidationException(e.Message);
            }
        }

        public async Task<AppointmentDto> UpdateAsync(AppointmentDto dto)
        {
            CheckStatus(dto.AppStatus);

            var appointment = await this._repo.GetByIdAsync(new AppointmentId(dto.Id));

            if (appointment == null)
                return null;

            appointment.ChangeStatus(dto.AppStatus);

            await this._unitOfWork.CommitAsync();

            return new AppointmentDto(appointment.Id.AsGuid(), appointment.RoomId, appointment.OperationRequestId, appointment.Date, appointment.AppStatus, appointment.AppointmentSlot);
        }

        public async Task<AppointmentDto> DeleteAsync(AppointmentId id)
        {
            var appointment = await this._repo.GetByIdAsync(id);

            if (appointment == null)
                return null;

            this._repo.Remove(appointment);
            await this._unitOfWork.CommitAsync();

            return new AppointmentDto(appointment.Id.AsGuid(), appointment.RoomId, appointment.OperationRequestId, appointment.Date, appointment.AppStatus, appointment.AppointmentSlot);
        }

        private async Task checkRoomIdAsync(SurgeryRoomId doctorId)
        {
            var category = await _repoRooms.GetByIdAsync(doctorId);
            if (category == null)
                throw new BusinessRuleValidationException("Invalid Room Id.");
        }


        private async Task checkOperationRequestIdAsync(OperationRequestId operationRequestId)
        {
            var operationRequest = await _repoOpReq.GetByIdAsync(operationRequestId);
            if (operationRequest == null)
                throw new BusinessRuleValidationException("Invalid OperationRequest Id.");
        }

        private static void CheckStatus(String status)
        {
            if (!AppointmentStatus.IsValid(status.ToUpper()))
                throw new BusinessRuleValidationException("Invalid Status.");
        }

        public async Task<string> ScheduleAppointments2(DataInputModel prologDto)
        {
            DateTime date = prologDto.Date;

            List<StaffProfile> staff = await _repoStaff.GetAllAsync();
            List<OperationRequest> request = await _repoOpReq.GetAllAsync();
            List<OperationType> types = await _repoOpTy.GetAllAsync();
            List<SurgeryRoom> rooms = await _repoRooms.GetAllAsync();
            List<Appointment> appointments = await _repo.GetAllAsync();


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

            List<RequestToProlog> prologRequests = new List<RequestToProlog>();

            foreach (var req in request)
            {
                if (req.Active)
                    prologRequests.Add(new RequestToProlog(req.Id.Value, req.OperationTypeId.Value));
            }

            List<OperationTypeToProlog> prologTypes = new List<OperationTypeToProlog>();
            List<RequiredStaffToProlog> prologRequiredStaff = new List<RequiredStaffToProlog>();

            foreach (var type in types)
            {

                var anethesia = type.EstimatedDuration.PatientPreparation.Minute + type.EstimatedDuration.PatientPreparation.Hour * 60;
                var surgery = type.EstimatedDuration.Surgery.Minute + type.EstimatedDuration.Surgery.Hour * 60;
                var cleaning = type.EstimatedDuration.Cleaning.Minute + type.EstimatedDuration.Cleaning.Hour * 60;

                prologTypes.Add(new OperationTypeToProlog(type.Id.Value, anethesia, surgery, cleaning));

                foreach (var staf in type.RequiredStaff)
                {
                    prologRequiredStaff.Add(new RequiredStaffToProlog(type.Id.Value, staf.Quantity, staf.Specialization, staf.Role));
                }
            }

            var data = new
            {
                day = date.ToString("yyyyMMdd"),
                prob_CrossOver = prologDto.Prob_CrossOver,
                prob_Mutation = prologDto.Prob_Mutation,
                n_Generations = prologDto.N_Generations,
                base_Population = prologDto.Base_Population,
                staffInfo = prologStaff,
                roomsInfo = prologRooms,
                operationRequests = prologRequests,
                opType = prologTypes,
                specializationAssignments = prologRequiredStaff
            };

            var url = configuration.GetValue<string>("PrologPath2");

            var response = await PostToPrologServer(url, data);

            var s = await FormatGeneticAlg(response, date);

            //Console.WriteLine(s);

            return s;
        }

        public async Task<string> FormatGeneticAlg(string jsonString, DateTime dateOfAppointments)
        {
            var data = JArray.Parse(jsonString);
            var result = new StringBuilder();

            foreach (var room in data)
            {
                string roomId = room["roomId"].ToString();
                var specificRoom = await _repoRooms.GetByIdAsync(new SurgeryRoomId(roomId));

                var appointments = room["appointmentJson_array"];
                if (appointments != null && appointments.Count() > 0)
                    result.AppendLine($"\nRoom: {specificRoom.RoomNumber}");
                foreach (var appointment in appointments)
                {
                    string operationRequestId = appointment["operationRequestId"].ToString();
                    int start = appointment["instanteInicial"].ToObject<int>();
                    int end = appointment["instanteFinal"].ToObject<int>();

                    result.AppendLine($"  Operation Request: {operationRequestId}");
                    var operationRequestIdObj = new OperationRequestId(operationRequestId);
                    var specificOperationReequest = await InactivateAsync(operationRequestIdObj);

                    result.AppendLine($"  Time: {FormattedDate(dateOfAppointments.AddMinutes(start))} to {FormattedDate(dateOfAppointments.AddMinutes(end))}");
                    result.AppendLine("  Associated Staff:");


                    var date = new Slot(dateOfAppointments.AddMinutes(start), dateOfAppointments.AddMinutes(end));

                    var staffArray = appointment["staffArray"];
                    var appointmentSlots = new List<AppointmentSlot>();

                    foreach (var staff in staffArray)
                    {
                        string staffId = staff["staffId"].ToString();
                        int staffStart = staff["instanteInicial"].ToObject<int>();
                        int staffEnd = staff["instanteFinal"].ToObject<int>();

                        var staffGuid = new StaffGuid(staffId);

                        var staffSlot = new Slot(dateOfAppointments.AddMinutes(staffStart), dateOfAppointments.AddMinutes(staffEnd));

                        var appointmentSlot = new AppointmentSlot(staffSlot, staffGuid);
                        appointmentSlots.Add(appointmentSlot);

                        var staffProfile = await _repoStaff.GetByIdAsync(staffGuid);

                        string staffStartTime = FormattedDate(dateOfAppointments.AddMinutes(staffStart));
                        string staffEndTime = FormattedDate(dateOfAppointments.AddMinutes(staffEnd));

                        result.AppendLine($"    License Number: {staffProfile.LicenseNumber} – {staffStartTime} to {staffEndTime}");


                        RemoveOccupiedSlotFromAvailability(staffProfile, staffSlot);


                    }

                    var roomIdObj = new SurgeryRoomId(roomId);

                    await AddAsync(new CreatingAppointmentDto(roomIdObj, operationRequestIdObj, date, appointmentSlots));
                }
            }

            return await Task.FromResult(result.ToString());
        }

        private void RemoveOccupiedSlotFromAvailability(StaffProfile staffProfile, Slot occupiedSlot)
        {
            var availableSlots = staffProfile.AvailabilitySlots;

            for (int i = availableSlots.Count - 1; i >= 0; i--)
            {
                var availableSlot = availableSlots[i];

                if (availableSlot.StartTime < occupiedSlot.EndTime && availableSlot.EndTime > occupiedSlot.StartTime)
                {

                    availableSlots.RemoveAt(i);

                    if (availableSlot.StartTime < occupiedSlot.StartTime)
                    {
                        availableSlots.Add(new Slot(availableSlot.StartTime, occupiedSlot.StartTime));
                    }

                    if (availableSlot.EndTime > occupiedSlot.EndTime)
                    {
                        availableSlots.Add(new Slot(occupiedSlot.EndTime, availableSlot.EndTime));
                    }
                }
            }
        }

        public async Task<OperationRequest> InactivateAsync(OperationRequestId id)
        {
            var operationRequest = await this._repoOpReq.GetByIdAsync(id);

            if (operationRequest == null)
                return null;

            operationRequest.MarkAsInative();

            return operationRequest;
        }

        private static string FormattedDate(DateTime date, string format = "HH:mm:ss")
        {
            string formattedDate = date.ToString(format);
            return formattedDate;
        }
    }
}