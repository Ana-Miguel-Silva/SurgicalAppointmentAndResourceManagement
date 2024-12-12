using DDDSample1.Domain.Shared;
using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Appointments;
using Newtonsoft.Json;
using System.Text;
using Microsoft.Extensions.Configuration;
using DDDSample1.Domain.Staff;
using Newtonsoft.Json;
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

        public async Task<string> ScheduleAppointments()
        {

            var url = configuration.GetValue<string>("PrologPath");

            var st = PostToPrologServer(configuration.GetValue<string>("PrologPath"), "").Result;

            var s = await FormatSurgerySchedules(st);

            return s;
        }

        public async Task<string> ScheduleAppointments2()
        {
            //DateTime date = new DateTime(2025, 10, 10);
            DateTime date = new DateTime(2025, 10, 10);

            PrologDto prologDto = new PrologDto("20251010", 0.5, 0.5, 6, 6);

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
                    if (slot.StartTime.Day == date.Day)
                    {
                        slots.Add(slot.StartTime.Hour * 60 + slot.StartTime.Minute);
                        slots.Add(slot.EndTime.Hour * 60 + slot.EndTime.Minute);
                    }
                }

                if (slots.Count != 0)
                    prologStaff.Add(new StaffToProlog(sta.StaffId, sta.Role, sta.Specialization, slots));
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
                day = prologDto.Day,
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

            var json = JsonConvert.SerializeObject(data);

            Console.WriteLine(json);

            var response = await PostToPrologServer(url, data);

            Console.WriteLine(response);

            //json



            //var s = await FormatSurgerySchedules2(st);

            return "Sui";
        }

        public async Task<AppointmentDto> AddAsync(CreatingAppointmentDto dto)
        {

            var appointment = new Appointment(dto.RoomId, dto.OperationRequestId, dto.Date, dto.Appstatus, dto.AppointmentSlot);

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

        private static void CheckDate(Slot date)
        {
            if (date == null)
                throw new BusinessRuleValidationException("Invalid Appointment Date.");
        }

        private static void CheckStatus(String status)
        {
            if (!AppointmentStatus.IsValid(status.ToUpper()))
                throw new BusinessRuleValidationException("Invalid Status.");
        }

        public Task<string> FormatSurgerySchedules(string jsonString)
        {
            var data = JObject.Parse(jsonString);

            var s = ProcessSchedule(data);

            return s;
        }

        public Task<string> FormatSurgerySchedules2(string jsonString)
        {
            var data = JObject.Parse(jsonString);

            var s = ProcessRoomSchedules(data);

            return s;
        }

        public async Task<string> ProcessSchedule(JObject data)
        {

            var roomId = data["room"].ToString();
            var date = (int)data["day"];
            var rooms = data["rooms"];
            var doctors = data["doctors"];

            var operations = new Dictionary<string, AppointmentPlaningModuleHelper>();

            DateTime dateTime = new DateTime(date / 10000, date / 100 % 100, date % 100);

            foreach (var room in rooms)
            {
                var operationId = room["idDaOperacao"].ToString();
                var operationStart = (int)room["instanteInicial"];
                var operationEnd = (int)room["instanteFinal"];

                if (!operations.ContainsKey(operationId))
                {
                    operations[operationId] = new AppointmentPlaningModuleHelper
                    {
                        Start = operationStart,
                        End = operationEnd
                    };
                }

                foreach (var doctor in doctors)
                {
                    var staffId = doctor["staffId"].ToString();
                    var agendaArray = doctor["agenda_array"];

                    foreach (var agenda in agendaArray)
                    {
                        if (agenda["idDaOperecao"].ToString() == operationId)
                        {
                            var staffStart = (int)agenda["instanteInicial"];
                            var staffEnd = (int)agenda["instanteFinal"];
                            operations[operationId].Staff.Add(new StaffHelper
                            {
                                StaffId = staffId,
                                Start = staffStart,
                                End = staffEnd
                            });
                        }
                    }
                }
            }

            SurgeryRoomId roomCustomId = new SurgeryRoomId(Guid.NewGuid());

            string formatedString = "Room: " + roomId + "\nDay: " + dateTime.ToString("dd-MM-yyyy") + "\n";

            foreach (var operation in operations)
            {
                formatedString += "\n\nOperation " + operation.Key;
                formatedString += " | Duration: " + dateTime.AddMinutes(operation.Value.Start).TimeOfDay + " - " + dateTime.AddMinutes(operation.Value.End).TimeOfDay;
                formatedString += "\nRequired Staff:";

                var list = new List<AppointmentSlot>();

                foreach (var staff in operation.Value.Staff)
                {
                    list.Add(new AppointmentSlot(new Slot(dateTime.AddMinutes(staff.Start), dateTime.AddMinutes(staff.End)), new StaffGuid(staff.StaffId + "6dba-0b3d-4248-9c44-ccde4b07d1eb")));

                    formatedString += "\n" + staff.StaffId + " | Schedule: " + dateTime.AddMinutes(staff.Start).TimeOfDay + " - " + dateTime.AddMinutes(staff.End).TimeOfDay;

                }

                var dto = new CreatingAppointmentDto(roomCustomId, new OperationRequestId(Guid.NewGuid()), new Slot(dateTime.AddMinutes(operation.Value.Start), dateTime.AddMinutes(operation.Value.End)), list);

                await AddAsync(dto);

            }

            return formatedString;

        }

        public async Task<string> ProcessRoomSchedules(JObject data)
        {
            var date = (int)data["day"];
            var roomSchedules = data["rooms"];

            DateTime dateTime = new DateTime(date / 10000, date / 100 % 100, date % 100);

            var operationsByRoom = new Dictionary<string, List<AppointmentPlaningModuleHelper>>();

            foreach (var room in roomSchedules)
            {
                var roomId = room["roomId"].ToString();
                var roomSchedule = room["roomSchedule"];
                var doctorSchedule = room["doctorSchedule"];

                var operations = new Dictionary<string, AppointmentPlaningModuleHelper>();

                foreach (var operation in roomSchedule)
                {
                    var operationId = operation["idDaOperacao"].ToString();
                    var operationStart = (int)operation["instanteInicial"];
                    var operationEnd = (int)operation["instanteFinal"];

                    if (!operations.ContainsKey(operationId))
                    {
                        operations[operationId] = new AppointmentPlaningModuleHelper
                        {
                            Start = operationStart,
                            End = operationEnd
                        };
                    }

                    foreach (var doctor in doctorSchedule)
                    {
                        var staffId = doctor["staffId"].ToString();
                        var agendaArray = doctor["agenda_array"];

                        foreach (var agenda in agendaArray)
                        {
                            if (agenda["idDaOperecao"].ToString() == operationId)
                            {
                                var staffStart = (int)agenda["instanteInicial"];
                                var staffEnd = (int)agenda["instanteFinal"];
                                operations[operationId].Staff.Add(new StaffHelper
                                {
                                    StaffId = staffId,
                                    Start = staffStart,
                                    End = staffEnd
                                });
                            }
                        }
                    }
                }

                operationsByRoom[roomId] = operations.Values.ToList();
            }

            string formattedString = $"Day: {dateTime:dd-MM-yyyy}\n";

            foreach (var roomEntry in operationsByRoom)
            {
                var roomId = roomEntry.Key;
                var operations = roomEntry.Value;

                formattedString += $"\nRoom: {roomId}\n";

                SurgeryRoomId roomCustomId = new SurgeryRoomId(Guid.NewGuid());

                foreach (var operation in operations)
                {
                    formattedString += $"\nOperation Duration: {dateTime.AddMinutes(operation.Start).TimeOfDay} - {dateTime.AddMinutes(operation.End).TimeOfDay}";
                    formattedString += "\nRequired Staff:";

                    var list = new List<AppointmentSlot>();

                    foreach (var staff in operation.Staff)
                    {
                        list.Add(new AppointmentSlot(
                            new Slot(dateTime.AddMinutes(staff.Start), dateTime.AddMinutes(staff.End)),
                            new StaffGuid(staff.StaffId + "6dba-0b3d-4248-9c44-ccde4b07d1eb")
                        ));

                        formattedString += $"\n{staff.StaffId} | Schedule: {dateTime.AddMinutes(staff.Start).TimeOfDay} - {dateTime.AddMinutes(staff.End).TimeOfDay}";
                    }

                    var dto = new CreatingAppointmentDto(
                        roomCustomId,
                        new OperationRequestId(Guid.NewGuid()),
                        new Slot(dateTime.AddMinutes(operation.Start), dateTime.AddMinutes(operation.End)),
                        list
                    );

                    await AddAsync(dto);
                }
            }

            return formattedString;
        }

    }
}