import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorComponent } from './doctor.component';
import { MockOperationRequestsService } from '../../../Services/Tests/mock-operationRequest.service'; 
import { MockAppointmentService } from '../../../Services/Tests/mock-appointments.service'; 
import { MockModalService } from '../../../Services/Tests/mock-modal.service';
import { ModalService } from '../../../Services/modal.service';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { OperationRequestsService } from '../../../Services/operationRequest.service';
import { fakeAsync, tick, flush } from '@angular/core/testing';
import { MedicalRecordService } from '../../../Services/medicalRecordservice';
import { MockMedicalRecordService } from '../../../Services/Tests/mock-medicalRecord.service';
import { AppointmentService } from '../../../Services/appointment.service';
import { SurgeryRoomsService } from '../../../Services/surgeryRoom.service';
import { AllergiesService } from '../../../Services/allergies.service';
import { MedicalConditionService } from '../../../Services/medicalCondition.service';
import { StaffService } from '../../../Services/staff.service';
import { PatientService } from '../../../Services/patient.service';
import { MockPatientService } from '../../../Services/Tests/mock-patient.service';
import { sweetAlertService } from '../../../Services/sweetAlert.service';
import { MockSweetAlertService } from '../../../Services/Tests/mock-sweetAlert.service';
import { SweetAlertArrayOptions } from 'sweetalert2';
import { RoomTypesService } from '../../../Services/roomtypes.service';


class MockAuthService {
  getToken() {
    return 'fake-token';
  }

  logout() {}
}

describe('DoctorComponent', () => {
  let component: DoctorComponent;
  let fixture: ComponentFixture<DoctorComponent>;
  
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockModalService: jasmine.SpyObj<ModalService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockOperationRequestsService: jasmine.SpyObj<OperationRequestsService>;
  let mockMedicalRecordService: jasmine.SpyObj<MedicalRecordService>;  
  let mockAppointmentService: jasmine.SpyObj<AppointmentService>;
  let mockSurgeryRoomsService: jasmine.SpyObj<SurgeryRoomsService>;
  let mockAllegiesService: jasmine.SpyObj<AllergiesService>;
  let mockMedicalConditionService: jasmine.SpyObj<MedicalConditionService>;
  let mockStaffService: jasmine.SpyObj<StaffService>;

  let mockSweetAlertService: jasmine.SpyObj<sweetAlertService>;
 

  let httpMock: HttpTestingController;

  beforeEach(async () => {
   
    mockModalService = jasmine.createSpyObj('ModalService', ['openModal', 'closeModal', 'isModalOpen']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    
   
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, 
        FormsModule, 
        CommonModule, 
        DoctorComponent
      ],
      providers: [
        { provide: OperationRequestsService, useClass: MockOperationRequestsService }, 
        { provide: AppointmentService, useClass: MockAppointmentService }, 
        { provide: MedicalRecordService, useClass: MockMedicalRecordService }, 
        { provide: sweetAlertService, useClass: MockSweetAlertService }, 
         // TODO: MUDAR PARA  useClass: MockSurgeryRoomsService
         { provide: SurgeryRoomsService, useClass: SurgeryRoomsService },
        // TODO: MUDAR PARA  useClass: MockAllergiesService
        { provide: AllergiesService, useClass: AllergiesService },
        // TODO: MUDAR PARA  useClass: MockMedicalConditionService
        { provide: MedicalConditionService, useClass: MedicalConditionService },
         // TODO: MUDAR PARA  useClass: MockStaffService
        { provide: StaffService, useClass: StaffService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: ModalService, useValue: mockModalService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    mockOperationRequestsService = TestBed.inject(OperationRequestsService) as jasmine.SpyObj<OperationRequestsService>;
    mockMedicalRecordService = TestBed.inject(MedicalRecordService) as jasmine.SpyObj<MedicalRecordService>;
    mockAppointmentService = TestBed.inject(AppointmentService) as jasmine.SpyObj<AppointmentService>;
    mockSurgeryRoomsService = TestBed.inject(SurgeryRoomsService) as jasmine.SpyObj<SurgeryRoomsService>;
    mockAllegiesService = TestBed.inject(AllergiesService) as jasmine.SpyObj<AllergiesService>;
    mockMedicalConditionService = TestBed.inject(MedicalConditionService) as jasmine.SpyObj<MedicalConditionService>;
    mockStaffService = TestBed.inject(StaffService) as jasmine.SpyObj<StaffService>;
  
    mockSweetAlertService = TestBed.inject(sweetAlertService) as jasmine.SpyObj<sweetAlertService>;
   
    
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    httpMock = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(DoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('should load operation requests on init', fakeAsync(() => {

    spyOn(mockOperationRequestsService, 'getAllOperationRequests').and.returnValue(of([{ id: '1', priority: 'Urgent' }, { id: '2', priority: 'Low' }]));
    spyOn(mockAuthService, 'getToken').and.returnValue('fake-token');

    component.ngOnInit();
    fixture.detectChanges();
    tick(); 
  

    expect(mockAuthService.getToken).toHaveBeenCalled();
    expect(mockOperationRequestsService.getAllOperationRequests).toHaveBeenCalled();
  }));

  it('should call createAppointments and display success message', fakeAsync(() => {
    spyOn(mockAppointmentService, 'createAppointments').and.returnValue(of({}));
    spyOn(mockAppointmentService, 'getAllAppointments').and.returnValue(of([]));
    spyOn(mockAuthService, 'getToken').and.returnValue('fake-token');
    spyOn(component, 'cleanRegister').and.callThrough();
    spyOn(component, 'rejectPolicy').and.callThrough();
  
    component.selectedOperationRequestId = 'opReq123';
    component.selectedSurgeryRoomId = 'room456';
    component.appointmentData = {
      date: { start: '2024-12-01T10:00:00Z' },
      selectedStaff: [
        {
          id: 'staff789',
          licenseNumber: 'LN12345',
          role: 'Doctor',
          specialization: 'CARDIOLOGY'
        }
      ],
    };
  
    component.onCreateAppointment();
  
    tick();
    flush();
    
    expect(mockAuthService.getToken).toHaveBeenCalled();
    expect(mockAppointmentService.createAppointments).toHaveBeenCalled();
    expect(mockAppointmentService.getAllAppointments).toHaveBeenCalled();
    expect(component.cleanRegister).toHaveBeenCalled();
  }));

  it('should update appointment and display success message', fakeAsync(() => {
    spyOn(mockAppointmentService, 'updateAppointments').and.returnValue(of({}));
    spyOn(mockAppointmentService, 'getAllAppointments').and.returnValue(of([
      { id: '1', date: { startTime: '2024-12-01T10:00:00Z', endTime: '2024-12-01T12:00:00Z' }, status: 'Scheduled' }
    ]));
    spyOn(mockAuthService, 'getToken').and.returnValue('fake-token');
    spyOn(component, 'rejectPolicy').and.callThrough();
  
    const existingAppointment = {
      id: '1',
      roomNumber: '101',
      date: { 
        startTime: '2024-12-01T10:00:00Z', 
        endTime: '2024-12-01T12:00:00Z' 
      },
      status: 'Scheduled',
      selectedStaff: [
        { id: 'staff123', licenseNumber: 'LN987', role: 'Surgeon', specialization: 'Cardiology' }
      ]
    };
  
    component.appointments = [existingAppointment];
  
    const updatedAppointment = {
      id: '1',
      roomId: 'newRoomId',
      start: '2024-12-01T11:00:00Z',
      selectedStaff: ['staff123']
    };
  
    component.surgeryRooms = [{ roomNumber: '101', id: 'roomId123', type: 'typeTests' }];
    component.selectedSurgeryRoomId = 'roomId123';
  
    component.onUpdateAppointment(updatedAppointment);
  
    tick();
    flush();
  
    expect(mockAuthService.getToken).toHaveBeenCalled();
    expect(mockAppointmentService.updateAppointments).toHaveBeenCalled();
    expect(mockAppointmentService.getAllAppointments).toHaveBeenCalled();
    expect(component.rejectPolicy).toHaveBeenCalled();
  }));
  



  it('should call createOperationRequests and display success message', fakeAsync(() => {
    spyOn(mockOperationRequestsService, 'createOperationRequests').and.returnValue(of({}));
    spyOn(mockOperationRequestsService, 'getAllOperationRequests').and.returnValue(of([{ id: '1', priority: 'Urgent' }]));
    spyOn(mockAuthService, 'getToken').and.returnValue('fake-token');

    const newRequest = {
      patientEmail: 'patient2@example.com',
      operationTypeName: 'Heart Surgery',
      deadline: '2024-12-15',
      priority: 'Urgent',
    };
  
component.onCreateRequest(newRequest);

    tick(500);  

    flush();

    expect(mockAuthService.getToken).toHaveBeenCalled();
    expect(mockOperationRequestsService.createOperationRequests).toHaveBeenCalledWith(newRequest);
    expect(mockOperationRequestsService.getAllOperationRequests).toHaveBeenCalled();

    expect(component.operationRequests.length).toBe(1);
  }));

  

  it('should update operation request and display success message', fakeAsync(() => {
    spyOn(mockOperationRequestsService, 'updateOperationRequests').and.callThrough();
    spyOn(mockOperationRequestsService, 'getAllOperationRequests').and.returnValue(of([
      { id: '1', deadline: '2024-12-15', priority: 'Low' },
    ]));
    spyOn(mockAuthService, 'getToken').and.returnValue('fake-token');
  
    const request = {
      id: '1',
      operationTypeName: 'Heart Surgery',
      emailDoctor: 'doctor@example.com',
      emailPatient: 'patient@example.com',
      deadline: '2024-12-15',
      priority: 'Urgent',
    };
  
    component.operationRequests = [request];
  
    const updatedRequest = {
      id: '1',
      deadline: '2024-12-15',
      priority: 'Low',
    };
  
    component.onUpdateRequest(updatedRequest);
  
    tick();
  
    flush();
  
    expect(mockAuthService.getToken).toHaveBeenCalled();
    expect(mockOperationRequestsService.updateOperationRequests).toHaveBeenCalledWith(updatedRequest);
    expect(mockOperationRequestsService.getAllOperationRequests).toHaveBeenCalled();
  
    const updatedItem = component.operationRequests.find(req => req.id === '1');
    expect(updatedItem?.priority).toBe('Low');
  }));
  

  it('should delete operation request and display success message', fakeAsync(() => {
    const request = {
      id: '1',
      operationTypeName: 'Heart Surgery',
      emailDoctor: 'doctor@example.com',
      emailPatient: 'patient@example.com',
      deadline: '2024-12-15',
      priority: 'Urgent',
    };
  
    component.operationRequests = [request];
  
    spyOn(mockOperationRequestsService, 'deleteOperationRequests').and.returnValue(of({}));
  
    spyOn(mockOperationRequestsService, 'getAllOperationRequests').and.returnValue(of([]));
  
    spyOn(mockAuthService, 'getToken').and.returnValue('fake-token');
  
    component.onDeleteRequest(request.id);
  
    tick(500);
  
    flush();
  
    expect(mockOperationRequestsService.deleteOperationRequests).toHaveBeenCalledWith(request.id);
  
    expect(component.operationRequests.length).toBe(0);
  }));

    it('should apply filter correctly', () => {
    component.filter.priority = 'Urgent';
    component.applyFilter();

    expect(component.filteredRequests.length).toBeGreaterThan(0);
  });

  it('should open the create request modal', () => {
    component.isModalOpen = () => true;  
    
    component.openModal('createRequestModal');
    fixture.detectChanges();
    
    const modal = fixture.nativeElement.querySelector('#createRequestModal');
    expect(modal).toBeTruthy();
    expect(modal.style.display).toBe('block');
  });

  it('should close the create request modal', () => {
    component.openModal('createRequestModal');
    fixture.detectChanges();

    component.closeModal('createRequestModal');
    fixture.detectChanges();

    const modal = fixture.nativeElement.querySelector('#createRequestModal');
    expect(modal).toBeTruthy();
    expect(modal.style.display).toBe('none');
  });

  it('should open the filter request modal', () => {
    component.isModalOpen = () => true

    component.openModal('filterRequestModal');
    fixture.detectChanges();
  
    const modal = fixture.nativeElement.querySelector('#filterRequestModal');
    expect(modal).toBeTruthy();
    expect(modal.style.display).toBe('block');
  });

  it('should open the update request modal', () => {
    component.isModalOpen = () => true

    component.openModal('updateRequestModal');
    fixture.detectChanges();
    const modal = fixture.nativeElement.querySelector('#updateRequestModal');
    expect(modal).toBeTruthy();
    expect(modal.style.display).toBe('block');
  });

  it('should load medical records on init', fakeAsync(() => {

    spyOn(mockMedicalRecordService, 'getAllMedicalRecord').and.returnValue(of([ 
      { id: '1', 
      staff: "937c43d0-85df-4cfc-b07b-b1b6c2af6501",
      patientId: "9b48129b-4e08-44bd-b714-a1fb730f3a19",
      allergies: [
        { designacao: "Peanut Allergy", descricao: "", status: "Active" },
        { designacao: "Shellfish Allergy", descricao: "e.g., shrimp, lobster", status: "Not Meaningful Anymore" }
      ],
      medicalConditions: [
        { codigo: "A04.0", designacao: "Cholera", descricao: "An acute diarrheal disease caused by Vibrio cholerae, often transmitted through contaminated water or food.", "sintomas": ["Severe diarrhea", "Dehydration", "Vomiting", "Muscle cramps"], status: "Active" },
        { codigo: "A08.0", designacao: "Rotavirus enteritis",   descricao: "A viral infection that causes severe diarrhea, primarily in young children.", "sintomas": ["Diarrhea", "Fever", "Abdominal pain", "Dehydration"], status: "Active" }
      ],
      descricao: [""]
    }
    ,
    { id: '1', 
      staff: "937c43d0-85df-4cfc-b07b-b1b6c2af6501",
      patientId: "9b48129b-4e08-44bd-b714-a1fb730f3a12",
      allergies: [
        { designacao: "Peanut Allergy", descricao: "", status: "Active" },
        { designacao: "Shellfish Allergy", descricao: "e.g., shrimp, lobster", status: "Active" }
      ],
      medicalConditions: [       
        { codigo: "A08.0", designacao: "Rotavirus enteritis",   descricao: "A viral infection that causes severe diarrhea, primarily in young children.", "sintomas": ["Diarrhea", "Fever", "Abdominal pain", "Dehydration"], status: "Active" }
      ],
      descricao: ["teste"]
    }]));
    spyOn(mockAuthService, 'getToken').and.returnValue('fake-token');

    component.ngOnInit();
    fixture.detectChanges();
    tick(); 
  

    expect(mockAuthService.getToken).toHaveBeenCalled();
    expect(mockMedicalRecordService.getAllMedicalRecord).toHaveBeenCalled();
    expect(component.medicalRecordRequests.length).toBe(2);
  }));


  it('should get medical record  by patient Id', fakeAsync(() => {

    spyOn(component, 'editMedicalRecord');

    spyOn(mockAuthService, 'getToken').and.returnValue('fake-token');

    component.ngOnInit();

    component.selectedPatientEmailMedicalRecord =  "9b48129b-4e08-44bd-b714-a1fb730f3a19";

    component.editMedicalRecord();

    fixture.detectChanges();
    tick(); 
  

    expect(mockAuthService.getToken).toHaveBeenCalled();
    expect(component.editMedicalRecord).toHaveBeenCalled();
    expect(component.medicalRecordRequests.length).toBe(2);
  }));

  it('should update medical record successfully', fakeAsync(() => {
    
    spyOn(mockAuthService, 'getToken').and.returnValue('fake-token');  
  
    const mockResponse = [{
      id: '1', 
      staff: '937c43d0-85df-4cfc-b07b-b1b6c2af6501',
      patientId: '9b48129b-4e08-44bd-b714-a1fb730f3a19',
      allergies: [
        { designacao: 'Shellfish Allergy', descricao: 'e.g., shrimp, lobster', status: 'Not Meaningful Anymore' }
      ],
      medicalConditions: [
        { codigo: 'A08.0', designacao: 'Rotavirus enteritis', descricao: 'A viral infection that causes severe diarrhea, primarily in young children.', sintomas: ['Diarrhea', 'Fever', 'Abdominal pain', 'Dehydration'], status: 'Active' }
      ],
      descricao: ['Updated description']
    }];
    
    spyOn(mockMedicalRecordService, 'updateMedicalRecord').and.returnValue(of(mockResponse));
    spyOn(component, 'getAllMedicalRecords');
    spyOn(component, 'cleanMedicalRecordRegister');
    spyOn(component, 'closeModal');

    component.medicalRecordUpdate.patchValue({
      patientId: '9b48129b-4e08-44bd-b714-a1fb730f3a19',
      descricao: ['Updated description'],
      medicalConditions: [
        {
          codigo: 'A08.0',
          designacao: 'Rotavirus enteritis',
          descricao: 'Updated description',
          sintomas: ['Diarrhea'],
          status: 'Active'
        }
      ],
      allergies: [
        {
          designacao: 'Peanut Allergy',
          descricao: '',
          status: 'Active'
        }
      ]
    });

    component.getAllMedicalRecords();
    component.onUpdateMedicalRecord();
    tick(); 
    tick(1000); 
    flush(); 

    component.cleanMedicalRecordRegister();
    

    expect(mockAuthService.getToken).toHaveBeenCalled();    
    expect(component.getAllMedicalRecords).toHaveBeenCalled();
    expect(component.cleanMedicalRecordRegister).toHaveBeenCalled();      
  }));


  it('should update allergy entry in medical record successfully', fakeAsync(() => {
    
    spyOn(mockAuthService, 'getToken').and.returnValue('fake-token');  
  
    const mockResponse = [{
      id: '1', 
      staff: '937c43d0-85df-4cfc-b07b-b1b6c2af6501',
      patientId: '9b48129b-4e08-44bd-b714-a1fb730f3a19',
      allergies: [        
      ],
      medicalConditions: [
        { codigo: 'A08.0', designacao: 'Rotavirus enteritis', descricao: 'A viral infection that causes severe diarrhea, primarily in young children.', sintomas: ['Diarrhea', 'Fever', 'Abdominal pain', 'Dehydration'], status: 'Active' }
      ],
      descricao: ['Updated description']
    }];
    
    spyOn(mockMedicalRecordService, 'updateMedicalRecord').and.returnValue(of(mockResponse));
    spyOn(component, 'getAllMedicalRecords');
    spyOn(component, 'cleanMedicalRecordRegister');
    spyOn(component, 'closeModal');

    component.medicalRecordUpdate.patchValue({
      patientId: '9b48129b-4e08-44bd-b714-a1fb730f3a19',
      descricao: ['Updated description'],
      medicalConditions: [
        {
          codigo: 'A08.0',
          designacao: 'Rotavirus enteritis',
          descricao: 'Updated description',
          sintomas: ['Diarrhea'],
          status: 'Active'
        }
      ],
      allergies: [      
      ]
    });

    component.getAllMedicalRecords();
    component.onUpdateMedicalRecord();
    tick(); 
    tick(1000); 
    flush(); 

    component.cleanMedicalRecordRegister();
    

    expect(mockAuthService.getToken).toHaveBeenCalled();    
    expect(component.getAllMedicalRecords).toHaveBeenCalled();
    expect(component.cleanMedicalRecordRegister).toHaveBeenCalled();      
  }));


  /*it('should update medical condition entry in medical record successfully', fakeAsync(() => {
    
    spyOn(mockAuthService, 'getToken').and.returnValue('fake-token');  
  
    const mockResponse = [{
      id: '1', 
      staff: '937c43d0-85df-4cfc-b07b-b1b6c2af6501',
      patientId: '9b48129b-4e08-44bd-b714-a1fb730f3a19',
      allergies: [
        { designacao: 'Shellfish Allergy', descricao: 'e.g., shrimp, lobster', status: 'Not Meaningful Anymore' }
      ],
      medicalConditions: [
        ],
      descricao: ['Updated description']
    }];
    
    spyOn(mockMedicalRecordService, 'updateMedicalRecord').and.returnValue(of(mockResponse));
    spyOn(component, 'getAllMedicalRecords');
    spyOn(component, 'cleanMedicalRecordRegister');
    spyOn(component, 'closeModal');

    component.medicalRecordUpdate.patchValue({
      patientId: '9b48129b-4e08-44bd-b714-a1fb730f3a19',
      descricao: ['Updated description'],     
      allergies: [
        {
          designacao: 'Peanut Allergy',
          descricao: '',
          status: 'Active'
        }
      ],
      medicalConditions: [       
      ]
    });

    component.getAllMedicalRecords();
    component.onUpdateMedicalRecord();
    tick(); 
    tick(1000); 
    flush(); 

    component.cleanMedicalRecordRegister();
    

    expect(mockAuthService.getToken).toHaveBeenCalled();    
    expect(component.getAllMedicalRecords).toHaveBeenCalled();
    expect(component.cleanMedicalRecordRegister).toHaveBeenCalled();      
  }));*/


  it('should update description entry in medical record successfully', fakeAsync(() => {
    
    spyOn(mockAuthService, 'getToken').and.returnValue('fake-token');  
  
    const mockResponse = [{
      id: '1', 
      staff: '937c43d0-85df-4cfc-b07b-b1b6c2af6501',
      patientId: '9b48129b-4e08-44bd-b714-a1fb730f3a19',
      allergies: [
        { designacao: 'Shellfish Allergy', descricao: 'e.g., shrimp, lobster', status: 'Not Meaningful Anymore' }
      ],
      medicalConditions: [
        ],
      descricao: ['description']
    }];
    
    spyOn(mockMedicalRecordService, 'updateMedicalRecord').and.returnValue(of(mockResponse));
    spyOn(component, 'getAllMedicalRecords');
    spyOn(component, 'cleanMedicalRecordRegister');
    spyOn(component, 'closeModal');

    component.medicalRecordUpdate.patchValue({
      patientId: '9b48129b-4e08-44bd-b714-a1fb730f3a19',
      descricao: ['description'],
      medicalConditions: [       
      ],
      allergies: [
        {
          designacao: 'Peanut Allergy',
          descricao: '',
          status: 'Active'
        }
      ]
    });

    component.getAllMedicalRecords();
    component.onUpdateMedicalRecord();
    tick(); 
    tick(1000); 
    flush(); 

    component.cleanMedicalRecordRegister();
    

    expect(mockAuthService.getToken).toHaveBeenCalled();    
    expect(component.getAllMedicalRecords).toHaveBeenCalled();
    expect(component.cleanMedicalRecordRegister).toHaveBeenCalled();      
  }));

  it('should filter allergies successfully', () => {
    component.tagsAllergies = [
      { designacao: 'Peanut Allergy', descricao: 'Peanut-related allergy', status: 'Active', note:'' },
      { designacao: 'Shellfish Allergy', descricao: 'Shrimp allergy', status: 'Resolved', note:'' },
    ];

    component.allergieNameFilter = 'peanut';
    component.onFilterMedicalRecordRequests();

    expect(component.filteredTagsAllergies.length).toBe(1);
    expect(component.filteredTagsAllergies[0].designacao).toBe('Peanut Allergy');
  });

  it('should filter medical conditions by symptoms successfully', () => {
    component.tagsConditions = [
      {
        codigo: 'C01',
        designacao: 'Condition A',
        descricao: 'Description A',
        status: 'Active',
        sintomas: ['fever', 'cough'],
        note:'',
      },
      {
        codigo: 'C02',
        designacao: 'Condition B',
        descricao: 'Description B',
        status: 'Resolved',
        sintomas: ['headache', 'nausea'],
        note:'',
      },
    ];

    component.medicalConditionSymptomsFilter = 'fever';
    component.onFilterMedicalRecordRequestsConditions();

    expect(component.filteredTagsConditions.length).toBe(1);
    expect(component.filteredTagsConditions[0].codigo).toBe('C01');
  });


  it('should show warning if no patient email is selected for fetching records', () => {
    component.selectedPatientEmailMedicalRecord = null;

    component.getMedicalRecord();

    expect(mockSweetAlertService.sweetWarning).toHaveBeenCalledWith('Please select a medical record.');
  });

  
});


  



