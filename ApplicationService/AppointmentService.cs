using DDDSample1.Domain.Shared;
using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Appointments;
using Newtonsoft.Json;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace DDDSample1.ApplicationService.Appointments
{
    public class AppointmentService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAppointmentRepository _repo;
        private readonly ISurgeryRoomRepository _repoRooms;
        private readonly IOperationRequestRepository _repoOpReq;
        private readonly HttpClient _httpClient;
        public IConfiguration configuration { get; }


        public AppointmentService(IUnitOfWork unitOfWork, IAppointmentRepository repo, ISurgeryRoomRepository repoSurgeryRooms, IOperationRequestRepository repoOperationRequests, IConfiguration configuration)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._repoRooms = repoSurgeryRooms;
            this._repoOpReq = repoOperationRequests;
            _httpClient = new HttpClient();
            this.configuration = configuration;
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
            return PostToPrologServer(url, "").Result;
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

    }
}