using DDDSample1.Domain.Shared;
using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Appointments;
using Newtonsoft.Json;
using System.Text;
using DDDSample1.Domain.Staff;
using Newtonsoft.Json.Linq;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Patients;

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
        private readonly IPatientRepository _repoPat;

        private readonly HttpClient _httpClient;
        public IConfiguration configuration { get; }


        public AppointmentService(IUnitOfWork unitOfWork, IAppointmentRepository repo, ISurgeryRoomRepository repoSurgeryRooms, IOperationRequestRepository repoOperationRequests, IStaffRepository repoStaff, IOperationTypeRepository repoOpTy, IPatientRepository repoPat, IConfiguration configuration)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._repoRooms = repoSurgeryRooms;
            this._repoOpReq = repoOperationRequests;
            _httpClient = new HttpClient();
            this.configuration = configuration;
            this._repoStaff = repoStaff;
            this._repoOpTy = repoOpTy;
            this._repoPat = repoPat;
        }

        public async Task<List<AppointmentUIDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();

            List<AppointmentDto> listDto = list.ConvertAll<AppointmentDto>(Appointment =>
                new(Appointment.Id.AsGuid(), Appointment.RoomId, Appointment.OperationRequestId, Appointment.Date, Appointment.AppStatus, Appointment.AppointmentSlot));

            return await Appointment_Dto_to_UIDto(listDto);
        }

        public async Task<AppointmentDto> GetByIdAsync(AppointmentId id)
        {
            var Appointment = await this._repo.GetByIdAsync(id);

            if (Appointment == null)
                return null;

            return new AppointmentDto(Appointment.Id.AsGuid(), Appointment.RoomId, Appointment.OperationRequestId, Appointment.Date, Appointment.AppStatus, Appointment.AppointmentSlot);
        }
        public async Task<AppointmentDto> AddAsync(CreatingAppointmentDto dto, string appointmentId)
        {

            var room = await checkRoomIdAsync(dto.RoomId);
            var operationRequest = await checkOperationRequestIdAsync(dto.OperationRequestId);
            var operationType = await _repoOpTy.GetByIdAsync(operationRequest.OperationTypeId);


            var start = DateTime.Parse(dto.Start);
            var end = start.AddMinutes(operationType.EstimatedDuration.GetTotalDuration().ToTimeSpan().TotalMinutes);
            Slot newAppointmentSlot = new Slot(start, end);

            await CheckRoomAvailability(newAppointmentSlot, room);

            await CheckRequiredStaff(operationType.RequiredStaff, dto.SelectedStaff);

            List<AppointmentSlot> appointmentSlots = await CheckStaffAvailability(dto.SelectedStaff, operationType, start);

            Appointment appointment;

            if (appointmentId != null)
            {
                appointment = new Appointment(appointmentId, dto.RoomId, dto.OperationRequestId, newAppointmentSlot, AppointmentStatus.SCHEDULED, appointmentSlots);
            }
            else
            {
                appointment = new Appointment(dto.RoomId, dto.OperationRequestId, newAppointmentSlot, AppointmentStatus.SCHEDULED, appointmentSlots);
            }

            await InactivateAsync(dto.OperationRequestId);

            await this._repo.AddAsync(appointment);

            await this._unitOfWork.CommitAsync();

            return new AppointmentDto(appointment.Id.AsGuid(), appointment.RoomId, appointment.OperationRequestId, appointment.Date, appointment.AppStatus, appointment.AppointmentSlot);
        }


        public async Task<AppointmentDto> AddAsyncPlanningModule(SurgeryRoomId roomId, OperationRequestId operationRequestId, Slot date, List<AppointmentSlot> appointmentSlots)
        {
            var appointment = new Appointment(roomId, operationRequestId, date, AppointmentStatus.SCHEDULED, appointmentSlots);

            await checkRoomIdAsync(roomId);
            await checkOperationRequestIdAsync(operationRequestId);

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

        public async Task<AppointmentDto> UpdateAsync(UpdateAppointmentDto dto)
        {
            await checkRoomIdAsync(dto.RoomId);

            var oldAppointment = await this._repo.GetByIdAsync(new AppointmentId(dto.Id));

            if (oldAppointment == null)
                return null;

            await DeleteAsync(oldAppointment.Id);

            AppointmentDto appointment;
            try
            {
                if (dto.SelectedStaff == null || dto.SelectedStaff.Count == 0)
                {
                    appointment = await AddAsync(new CreatingAppointmentDto(dto.RoomId.Value, oldAppointment.OperationRequestId.Value, dto.Start, oldAppointment.GetAllStaff()), oldAppointment.Id.Value);
                }
                else
                {
                    appointment = await AddAsync(new CreatingAppointmentDto(dto.RoomId.Value, oldAppointment.OperationRequestId.Value, dto.Start, dto.SelectedStaff), oldAppointment.Id.Value);
                }
            }
            catch (BusinessRuleValidationException e)
            {
                await AddAsync(new CreatingAppointmentDto(oldAppointment.RoomId.Value, oldAppointment.OperationRequestId.Value, oldAppointment.Date.StartTime.ToString("o"), oldAppointment.GetAllStaff()), oldAppointment.Id.Value);
                throw new BusinessRuleValidationException("Appointments was not updated." + e);
            }

            await this._unitOfWork.CommitAsync();

            return appointment;
        }

        public async Task<AppointmentDto> DeleteAsync(AppointmentId id)
        {
            var appointment = await this._repo.GetByIdAsync(id);

            if (appointment == null)
                return null;

            foreach (var slot in appointment.AppointmentSlot)
            {
                var staff = await _repoStaff.GetByIdAsync(slot.Staff);
                AddFreeSlotToAvailability(staff, slot.AppointmentTime);
            }

            await ActivateAsync(appointment.OperationRequestId);

            this._repo.Remove(appointment);
            await this._unitOfWork.CommitAsync();

            return new AppointmentDto(appointment.Id.AsGuid(), appointment.RoomId, appointment.OperationRequestId, appointment.Date, appointment.AppStatus, appointment.AppointmentSlot);
        }

        private async Task<SurgeryRoom> checkRoomIdAsync(SurgeryRoomId doctorId)
        {
            var category = await _repoRooms.GetByIdAsync(doctorId);
            if (category == null)
                throw new BusinessRuleValidationException("Invalid Room Id.");
            return category;
        }


        private async Task<OperationRequest> checkOperationRequestIdAsync(OperationRequestId operationRequestId)
        {
            var operationRequest = await _repoOpReq.GetByIdAsync(operationRequestId);
            if (operationRequest == null)
                throw new BusinessRuleValidationException("Invalid OperationRequest Id.");
            return operationRequest;
        }

        private async Task CheckRoomAvailability(Slot newAppointmentSlot, SurgeryRoom room)
        {
            var appointments = await _repo.GetAllAsync();
            List<Slot> roomOccupiedSlots = new List<Slot>(room.MaintenanceSlots);

            foreach (var app in appointments)
            {
                if (app.RoomId == room.Id)
                {
                    roomOccupiedSlots.Add(app.Date);
                }
            }

            if (!VerifyOverlapRoom(roomOccupiedSlots, newAppointmentSlot))
            {
                throw new BusinessRuleValidationException("Room is not available at this time.");
            }
        }

        private async Task CheckRequiredStaff(List<RequiredStaff> requiredStaffList, List<string> staffIds)
        {
            List<StaffProfile> staffList = new List<StaffProfile>();

            int totalRequiredStaff = requiredStaffList.Sum(r => r.Quantity);

            foreach (var staffId in staffIds)
            {
                var staff = await _repoStaff.GetByIdAsync(new StaffGuid(staffId));
                staffList.Add(staff);
            }

            if (staffList.Count != totalRequiredStaff)
            {
                throw new BusinessRuleValidationException("HHHAppointment selected staff does not correspond to operation Type's required staff.");
            }

            var groupedStaff = staffList
                .GroupBy(s => new { s.Role, s.Specialization })
                .ToDictionary(g => g.Key, g => g.Count());

            foreach (var required in requiredStaffList)
            {
                var requiredStaffKey = new { Role = required.Role.ToUpper(), Specialization = required.Specialization.ToUpper() };

                if (!groupedStaff.ContainsKey(requiredStaffKey) || groupedStaff[requiredStaffKey] != required.Quantity)
                {
                    throw new BusinessRuleValidationException("Appointment selected staff does not correspond to operation Type's required staff.");
                }
            }
        }

        private async Task<List<AppointmentSlot>> CheckStaffAvailability(List<string> selectedStaff, OperationType operationType, DateTime start)
        {
            var newAppointmentSlots = new List<AppointmentSlot>();

            foreach (var staffId in selectedStaff)
            {
                var staff = await _repoStaff.GetByIdAsync(new StaffGuid(staffId));
                Slot convertedSlot = GetOccupiedSlot(operationType, start, staff);

                if (!VerifyOverlapStaff(staff, convertedSlot))
                {
                    throw new BusinessRuleValidationException("Staff is not available at this time.");
                }

            }

            foreach (var staffId in selectedStaff)
            {
                var staff = await _repoStaff.GetByIdAsync(new StaffGuid(staffId));
                Slot convertedSlot = GetOccupiedSlot(operationType, start, staff);

                RemoveOccupiedSlotFromAvailability(staff, convertedSlot);
                newAppointmentSlots.Add(new AppointmentSlot(convertedSlot, new StaffGuid(staffId)));
            }

            return newAppointmentSlots;
        }

        private static Slot GetOccupiedSlot(OperationType operationType, DateTime start, StaffProfile staff)
        {
            if (staff.Specialization == "ANAESTHETIST")
            {
                return new Slot(start, start.AddMinutes(
                    operationType.EstimatedDuration.PatientPreparation.ToTimeSpan().TotalMinutes +
                    operationType.EstimatedDuration.Surgery.ToTimeSpan().TotalMinutes
                ));
            }
            else if (staff.Specialization == "ASSISTANT")
            {
                return new Slot(start.AddMinutes(
                    operationType.EstimatedDuration.PatientPreparation.ToTimeSpan().TotalMinutes +
                    operationType.EstimatedDuration.Surgery.ToTimeSpan().TotalMinutes), start.AddMinutes(
                    operationType.EstimatedDuration.PatientPreparation.ToTimeSpan().TotalMinutes +
                    operationType.EstimatedDuration.Surgery.ToTimeSpan().TotalMinutes + operationType.EstimatedDuration.Cleaning.ToTimeSpan().TotalMinutes));
            }
            else
            {
                return new Slot(start.AddMinutes(operationType.EstimatedDuration.PatientPreparation.ToTimeSpan().TotalMinutes), start.AddMinutes(
                    operationType.EstimatedDuration.PatientPreparation.ToTimeSpan().TotalMinutes +
                    operationType.EstimatedDuration.Surgery.ToTimeSpan().TotalMinutes));
            }
        }

        private static void CheckStatus(String status)
        {
            if (!AppointmentStatus.IsValid(status.ToUpper()))
                throw new BusinessRuleValidationException("Invalid Status.");
        }

        public async Task<string> ScheduleAppointments(ScheduleInputData prologDto)
        {
            DateTime date = prologDto.Date;

            List<StaffProfile> staff = await _repoStaff.GetAllAsync();
            List<OperationRequest> request = await _repoOpReq.GetAllAsync();
            List<OperationType> types = await _repoOpTy.GetAllAsync();
            List<SurgeryRoom> rooms = await _repoRooms.GetAllAsync();
            List<Appointment> appointments = await _repo.GetAllAsync();

            var helper = new PrologUtils();

            var prologStaff = helper.getPrologStaffList(staff, date);

            var prologRooms = helper.getPrologRoomsList(rooms, appointments, date);

            var prologRequests = helper.getPrologRequestList(request);

            var (prologTypes, prologRequiredStaff) = helper.GeneratePrologData(types);

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
            var preview = await FormatGeneticAlg(response, date);

            return preview;
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
                bool hasAppointments = appointments != null && appointments.Any();

                if (hasAppointments)
                {
                    result.AppendLine($"\nRoom: {specificRoom.RoomNumber}");
                }

                foreach (var appointment in appointments)
                {
                    await AppendAppointmentDetails(appointment, roomId, dateOfAppointments, result);
                }

                if (hasAppointments)
                {
                    result.AppendLine("------------------------------------------------------------------------------------------");
                }
            }

            return await Task.FromResult(result.ToString());
        }

        private async Task AppendAppointmentDetails(JToken appointment, string roomId, DateTime dateOfAppointments, StringBuilder result)
        {
            string operationRequestId = appointment["operationRequestId"].ToString();
            int start = appointment["instanteInicial"].ToObject<int>();
            int end = appointment["instanteFinal"].ToObject<int>();

            var operationRequestIdObj = new OperationRequestId(operationRequestId);
            var specificOperationRequest = await InactivateAsync(operationRequestIdObj);

            result.AppendLine("Appointment Info:");
            result.AppendLine($"  Time: {FormattedDate(dateOfAppointments.AddMinutes(start))} to {FormattedDate(dateOfAppointments.AddMinutes(end))}");
            result.AppendLine($"  Patient Email: {specificOperationRequest.EmailPatient}");
            result.AppendLine($"  Priority: {specificOperationRequest.Priority}");
            result.AppendLine($"  Operation Type: {specificOperationRequest.OperationTypeName}\n");
            result.AppendLine("  Associated Staff:");

            var date = new Slot(dateOfAppointments.AddMinutes(start), dateOfAppointments.AddMinutes(end));
            var appointmentSlots = await AppendStaffDetails(appointment, dateOfAppointments, result);

            var roomIdObj = new SurgeryRoomId(roomId);

            await AddAsyncPlanningModule(roomIdObj, operationRequestIdObj, date, appointmentSlots);
        }

        private async Task<List<AppointmentSlot>> AppendStaffDetails(JToken appointment, DateTime dateOfAppointments, StringBuilder result)
        {
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

            return appointmentSlots;
        }

        public async Task<OperationRequestUIDto> InactivateAsync(OperationRequestId id)
        {
            var operationRequest = await _repoOpReq.GetByIdAsync(id);

            if (operationRequest == null)
            {
                return null;
            }

            operationRequest.MarkAsInative();
            return await Dto_to_UIDto(operationRequest);
        }

        public async Task ActivateAsync(OperationRequestId id)
        {
            var operationRequest = await _repoOpReq.GetByIdAsync(id);

            if (operationRequest == null)
            {
                return;
            }

            operationRequest.MarkAsInative();
            return;
        }

        private async Task<OperationRequestUIDto> Dto_to_UIDto(OperationRequest operationRequest)
        {
            var operationTypes = await _repoOpTy.GetByIdAsync(operationRequest.OperationTypeId);
            var doctors = await _repoStaff.GetByIdAsync(operationRequest.DoctorId);
            var patients = await _repoPat.GetByIdAsync(operationRequest.MedicalRecordNumber);

            return new OperationRequestUIDto(operationRequest.Id.AsGuid(), patients.Email.FullEmail, doctors.Email.FullEmail, operationTypes.Name, operationRequest.Deadline, operationRequest.Priority
            );
        }

        private async Task<List<AppointmentUIDto>> Appointment_Dto_to_UIDto(List<AppointmentDto> appointmentDto)
        {
            List<AppointmentUIDto> appointments = new List<AppointmentUIDto>();
            foreach (var appointment in appointmentDto)
            {
                var room = await _repoRooms.GetByIdAsync(appointment.RoomId);
                appointments.Add(new AppointmentUIDto(appointment.Id, room.RoomNumber.ToString(), appointment.OperationRequestId, appointment.Date));
            }
            return appointments;
        }
        private static string FormattedDate(DateTime date, string format = "HH:mm:ss")
        {
            return date.ToString(format);
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

        private void AddFreeSlotToAvailability(StaffProfile staffProfile, Slot freeSlot)
        {
            var availableSlots = staffProfile.AvailabilitySlots;

            for (int i = 0; i < availableSlots.Count; i++)
            {
                var currentSlot = availableSlots[i];

                if (freeSlot.StartTime <= currentSlot.EndTime && freeSlot.EndTime >= currentSlot.StartTime)
                {
                    freeSlot = new Slot(
                        new DateTime(Math.Min(freeSlot.StartTime.Ticks, currentSlot.StartTime.Ticks)),
                        new DateTime(Math.Max(freeSlot.EndTime.Ticks, currentSlot.EndTime.Ticks))
                    );

                    availableSlots.RemoveAt(i);
                    i--;
                }
            }
            availableSlots.Add(freeSlot);

            availableSlots.Sort((a, b) => a.StartTime.CompareTo(b.StartTime));
        }

        private bool VerifyOverlapStaff(StaffProfile staffProfile, Slot occupiedSlot)
        {
            var availableSlots = staffProfile.AvailabilitySlots;

            for (int i = availableSlots.Count - 1; i >= 0; i--)
            {
                var availableSlot = availableSlots[i];

                if (occupiedSlot.StartTime >= availableSlot.StartTime && occupiedSlot.EndTime <= availableSlot.EndTime)
                {
                    Console.WriteLine("Occupied Slot: " + occupiedSlot.StartTime + " - " + occupiedSlot.EndTime);
                    Console.WriteLine("Available Slot: " + availableSlot.StartTime + " - " + availableSlot.EndTime);
                    Console.WriteLine("\n\n\n\n\n-------------------------------------------------");
                    return true;
                }
            }

            return false;
        }


        private bool VerifyOverlapRoom(List<Slot> occupiedSlots, Slot newSlot)
        {

            foreach (var occupiedSlot in occupiedSlots)
            {
                if (occupiedSlot.StartTime <= newSlot.EndTime && occupiedSlot.EndTime >= newSlot.StartTime)
                    return false;
            }
            return true;
        }



    }
}