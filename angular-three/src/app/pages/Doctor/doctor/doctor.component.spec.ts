import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorComponent } from './doctor.component';
import { MockOperationRequestsService } from '../../../Services/Tests/mock-operationRequest.service'; 
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
        { provide: MedicalRecordService, useClass: MockMedicalRecordService }, 
        
          // TODO: MUDAR PARA  useClass: MockAppointmentService
        { provide: AppointmentService, useClass: AppointmentService },
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
    expect(component.operationRequests.length).toBe(2);
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
      descricao: ""
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
      descricao: "teste"
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

    spyOn(mockMedicalRecordService, 'getAllMedicalRecordByPatientId').and.callThrough();

    spyOn(mockAuthService, 'getToken').and.returnValue('fake-token');

    component.ngOnInit();

    component.selectedPatientEmailMedicalRecord =  "9b48129b-4e08-44bd-b714-a1fb730f3a19";

    component.editMedicalRecord();

    fixture.detectChanges();
    tick(); 
  

    expect(mockAuthService.getToken).toHaveBeenCalled();
    expect(mockMedicalRecordService.getAllMedicalRecordByPatientId).toHaveBeenCalled();
    expect(component.operationRequests.length).toBe(2);
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
        descricao: 'Updated description'
      }];
      
      spyOn(mockMedicalRecordService, 'updateMedicalRecord').and.returnValue(of(mockResponse));
      spyOn(component, 'getAllMedicalRecords');
      spyOn(component, 'cleanMedicalRecordRegister');
      spyOn(component, 'closeModal');
  
      component.medicalRecordUpdate.patchValue({
        patientId: '9b48129b-4e08-44bd-b714-a1fb730f3a19',
        descricao: 'Updated description',
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
});
  



