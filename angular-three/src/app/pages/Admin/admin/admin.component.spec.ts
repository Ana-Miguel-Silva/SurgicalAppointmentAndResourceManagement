import { AdminComponent } from './admin.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../../../Services/auth.service';
import { MockOperationTypesService } from '../../../Services/Tests/mock-operationTypes.service';
import { MockStaffService } from '../../../Services/Tests/mock-staff.service';
/*import { MockPatientService } from '../../../Services/Tests/mock-patient.service';
import { PatientService } from '../../../Services/patient.service';*/

import { OperationTypesService } from '../../../Services/operationTypes.service.';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModalService } from '../../../Services/modal.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { fakeAsync, tick, flush } from '@angular/core/testing';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment'; // Importa o environment correto
import { StaffService } from '../../../Services/staff.service';
import { AppointmentService } from '../../../Services/appointment.service';
import { MedicalRecordService } from '../../../Services/medicalRecordservice';
import { MockMedicalRecordService } from '../../../Services/Tests/mock-medicalRecord.service';
import { AllergiesService } from '../../../Services/allergies.service';
import { MedicalConditionService } from '../../../Services/medicalCondition.service';
import { SpecializationService } from '../../../Services/specialization.service';
class MockAuthService {
  getToken() {
    return 'fake-token';
  }
}

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let mockOperationTypeService: jasmine.SpyObj<OperationTypesService>;
  let mockStaffService: jasmine.SpyObj<StaffService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockModalService: jasmine.SpyObj<ModalService>;
  let mockMedicalRecordService: jasmine.SpyObj<MedicalRecordService>;
  let mockAllegiesService: jasmine.SpyObj<AllergiesService>;
  let mockMedicalConditionService: jasmine.SpyObj<MedicalConditionService>;
  let mockSpecializationService: jasmine.SpyObj<SpecializationService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let httpMock: HttpTestingController;
  let mockHttpClient: jasmine.SpyObj<HttpClient>;
  let mockHttpClientGet: jasmine.SpyObj<HttpClient>;



  beforeEach(async () => {

    mockModalService = jasmine.createSpyObj('ModalService', ['openModal', 'closeModal', 'isModalOpen']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        AdminComponent,
        HttpClientTestingModule,
        FormsModule,
        CommonModule,
      ],
      providers: [
        { provide: OperationTypesService, useClass: MockOperationTypesService },
        { provide: AppointmentService, useClass: AppointmentService },
        { provide: StaffService, useClass: MockStaffService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: ModalService, useValue: mockModalService },
        { provide: MedicalRecordService, useClass: MockMedicalRecordService }, 
          // TODO: MUDAR PARA  useClass: MockAllergiesService
        { provide: AllergiesService, useClass: AllergiesService },
         // TODO: MUDAR PARA  useClass: MockMedicalConditionService
        { provide: MedicalConditionService, useClass: MedicalConditionService },
        // TODO: MUDAR PARA  useClass: MockSpecializationService
        { provide: SpecializationService, useClass: SpecializationService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    mockOperationTypeService = TestBed.inject(OperationTypesService) as jasmine.SpyObj<OperationTypesService>;
    mockMedicalRecordService = TestBed.inject(MedicalRecordService) as jasmine.SpyObj<MedicalRecordService>;
    mockStaffService = TestBed.inject(StaffService) as jasmine.SpyObj<StaffService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockAllegiesService = TestBed.inject(AllergiesService) as jasmine.SpyObj<AllergiesService>;
    mockMedicalConditionService = TestBed.inject(MedicalConditionService) as jasmine.SpyObj<MedicalConditionService>;
    mockSpecializationService = TestBed.inject(SpecializationService) as jasmine.SpyObj<SpecializationService>;



    httpMock = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();




  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call createOperationType and display success message', fakeAsync(() => {
    spyOn(mockOperationTypeService, 'createOperationTypes').and.returnValue(of({ success: true }));
    spyOn(mockOperationTypeService, 'getAllOperationTypes').and.returnValue(of([
      {
        name: 'Heart Surgery',
        requiredStaff: [
          { quantity: 2, specialization: 'Cardiologist', role: 'Surgeon' },
          { quantity: 1, specialization: 'Anesthesiologist', role: 'Support' },
        ],
        estimatedDuration: {
          patientPreparation: '15 mins',
          surgery: '2 hours',
          cleaning: '30 mins',
        },
      },
    ]));

    spyOn(mockAuthService, 'getToken').and.returnValue('fake-token');

    const newOperationType = {
      name: 'Appendectomy',
      requiredStaff: [
        { quantity: 1, specialization: 'General Surgeon', role: 'Surgeon' },
        { quantity: 1, specialization: 'Anesthesiologist', role: 'Support' },
      ],
      estimatedDuration: {
        patientPreparation: '10 mins',
        surgery: '1 hour',
        cleaning: '20 mins',
      },
    };

    component.onCreateOperationType(newOperationType);

    tick(500);

    flush();

    expect(mockAuthService.getToken).toHaveBeenCalled();
    expect(mockOperationTypeService.createOperationTypes).toHaveBeenCalledWith(newOperationType);
  }));

  it('should open the create operation type modal', () => {
    component.isModalOpen = () => true;

    component.openModal('createOperationTypeModal');
    fixture.detectChanges();

    const modal = fixture.nativeElement.querySelector('#createOperationTypeModal');
    expect(modal).toBeTruthy();
    expect(modal.style.display).toBe('block');
  });

  it('should close the create operation type modal', () => {
    component.openModal('createOperationTypeModal');
    fixture.detectChanges();

    component.closeModal('createOperationTypeModal');
    fixture.detectChanges();

    const modal = fixture.nativeElement.querySelector('#createOperationTypeModal');
    expect(modal).toBeTruthy();
    expect(modal.style.display).toBe('none');
  });

  it('should open the create staff modal', () => {
    component.isModalOpen = () => true;

    component.openModal('registerStaffModal');
    fixture.detectChanges();

    const modal = fixture.nativeElement.querySelector('#registerStaffModal');
    expect(modal).toBeTruthy();
    expect(modal.style.display).toBe('block');
  });

  it('should close the create staff modal', () => {
    component.openModal('registerStaffModal');
    fixture.detectChanges();

    component.closeModal('registerStaffModal');
    fixture.detectChanges();

    const modal = fixture.nativeElement.querySelector('#registerStaffModal');
    expect(modal).toBeTruthy();
    expect(modal.style.display).toBe('none');
  });


  /*it('should call createStaff and display success message', fakeAsync(() => {
    spyOn(mockStaffService, 'createStaff').and.returnValue(of({ success: true }));
    spyOn(mockStaffService, 'viewStaff').and.returnValue(of([
      {
        id: "818300ea-3854-4da0-b2d2-b1cdb2ee7fb2",
        licenseNumber: "100493647",
        staffId: "D20241",
        name: {
          "firstName": "Gerald",
          "middleNames": "Ivo",
          "lastName": "Robotnik"
        },
        role: "DOCTOR",
        specialization: "ORTHOPEDICS",
        email: {
          "fullEmail": "avlismana@gmail.com"
        },
        phoneNumber: {
          "number": "966783434"
        },
        slots: [
            {
                "startTime": "2024-10-10T10:00:00",
                "endTime": "2024-10-10T10:30:00"
            }
        ],
        active: true
      },
    ]));
    spyOn(mockAuthService, 'getToken').and.returnValue('fake-token');

    const newOperationType = {
      "email":"avlismana@gmail.com",
      "name":"Gerald Ivo Robotnik",
      "phoneNumber":966783434,
      "license":100493647,
      "specialization":"ORTHOPEDICS",
      "role":"DOCTOR",
      "slots":[{"start":"10/10/2024 10:00","end":"10/10/2024 10:30"}]
    };
    component.staffCreationForm2.setValue(newOperationType);
    component.createStaff();

    tick(500);

    flush();

    expect(mockAuthService.getToken).toHaveBeenCalled();
    expect(mockStaffService.createStaff).toHaveBeenCalledWith(newOperationType);
  }));*/


  /*it('should call editStaffPostA and display success message', fakeAsync(() => {
    spyOn(mockStaffService, 'editStaffPostA').and.returnValue(of({ success: true }));
    spyOn(mockStaffService, 'viewStaff').and.returnValue(of([
      {
        id: "818300ea-3854-4da0-b2d2-b1cdb2ee7fb2",
        licenseNumber: "100493647",
        staffId: "D20241",
        name: {
          "firstName": "Gerald",
          "middleNames": "Ivo",
          "lastName": "Robotnik"
        },
        role: "DOCTOR",
        specialization: "CARDIOLOGY",
        email: {
          "fullEmail": "doc9edit@gmail.com"
        },
        phoneNumber: {
          "number": "123456789"
        },
        slots: [
            {
                "startTime": "2024-10-10T10:00:00",
                "endTime": "2024-10-10T10:30:00"
            }
        ],
        active: true
      },
    ]));
    spyOn(mockAuthService, 'getToken').and.returnValue('fake-token');

    const newOperationType = {
      "email":"doc9edit@gmail.com",
      "phone":123456789,
      "specialization":"CARDIOLOGY",
      "slots":[]
    };
    component.selectStaff("D20241");
    component.staffEditionForm2.setValue(newOperationType);
    component.editStaffPost();

    tick(500);

    flush();

    expect(mockAuthService.getToken).toHaveBeenCalled();
    expect(mockStaffService.editStaffPostA).toHaveBeenCalledWith("D20241",newOperationType);
  }));
  it('should call editStaffPostB and display success message', fakeAsync(() => {
    spyOn(mockStaffService, 'editStaffPostB').and.returnValue(of({ success: true }));
    spyOn(mockStaffService, 'viewStaff').and.returnValue(of([
      {
        id: "818300ea-3854-4da0-b2d2-b1cdb2ee7fb2",
        licenseNumber: "100493647",
        staffId: "D20241",
        name: {
          "firstName": "Gerald",
          "middleNames": "Ivo",
          "lastName": "Robotnik"
        },
        role: "DOCTOR",
        specialization: "CARDIOLOGY",
        email: {
          "fullEmail": "doc9edit@gmail.com"
        },
        phoneNumber: {
          "number": "123456789"
        },
        slots: [
            {
                "startTime": "2024-10-10T10:00:00",
                "endTime": "2024-10-10T10:30:00"
            },
            {
                "startTime": "2024-10-10T11:00:00",
                "endTime": "2024-10-10T11:30:00"
            }
        ],
        active: true
      },
    ]));
    spyOn(mockAuthService, 'getToken').and.returnValue('fake-token');

    const newOperationType = {
      "email":"doc9edit@gmail.com",
      "phone":123456789,
      "specialization":"CARDIOLOGY",
      "slots":[{"start":"10/10/2024 11:00","end":"10/10/2024 11:30"}]
    };
    component.selectStaff("D20241");
    component.staffEditionForm2.setValue(newOperationType);
    component.editStaffPost();

    tick(500);

    flush();

    expect(mockAuthService.getToken).toHaveBeenCalled();
    expect(mockStaffService.editStaffPostB).toHaveBeenCalledWith("D20241",newOperationType);
  }));*/

  /*it('should call deactivateStaff and display success message', fakeAsync(() => {
    spyOn(mockStaffService, 'deactivateStaff').and.returnValue(of({ success: true }));
    spyOn(mockStaffService, 'viewStaff').and.returnValue(of([
      {
        id: "818300ea-3854-4da0-b2d2-b1cdb2ee7fb2",
        licenseNumber: "100493647",
        staffId: "D20241",
        name: {
          "firstName": "Gerald",
          "middleNames": "Ivo",
          "lastName": "Robotnik"
        },
        role: "DOCTOR",
        specialization: "CARDIOLOGY",
        email: {
          "fullEmail": "doc9edit@gmail.com"
        },
        phoneNumber: {
          "number": "123456789"
        },
        slots: [
            {
                "startTime": "2024-10-10T10:00:00",
                "endTime": "2024-10-10T10:30:00"
            }
        ],
        active: false
      },
    ]));
    spyOn(mockAuthService, 'getToken').and.returnValue('fake-token');

    component.selectStaff("D20241");
    component.deactivateStaff();

    tick(500);

    flush();

    expect(mockAuthService.getToken).toHaveBeenCalled();
    expect(mockStaffService.deactivateStaff).toHaveBeenCalledWith("D20241");
  }));*/




  it('should submit form successfully', () => {
    // Preparar o formulário com valores válidos
    component.myForm.setValue({
      name: 'John Doe',
      dateOfBirth: '1990-01-01',
      userEmail: 'john.doe@example.com',
      email: 'john.doe@example.com',
      phone: '123456789',
      gender: 'Male',
      emergencyContactName: 'Jane Doe',
      emergencyContactEmail: 'jane.doe@example.com',
      emergencyContactPhone: '987654321',
      appointmentHistory: []
     
    });

    // Adicionar valores ao appointmentHistory
    component.appointmentHistory = ['2021-09-15', '2022-10-10'];

    // Espiar o método Swal.fire
    const swalSpy = spyOn(Swal, 'fire');

    // Chamar o método onSubmit
    component.onSubmit();

    // Verificar a requisição HTTP
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/Patients/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    expect(req.request.body).toEqual({
      name: 'John Doe',
      dateOfBirth: '1990-01-01',
      userEmail: 'john.doe@example.com',
      email: 'john.doe@example.com',
      phone: '123456789',
      gender: 'Male',
      emergencyContactName: 'Jane Doe',
      emergencyContactEmail: 'jane.doe@example.com',
      emergencyContactPhone: '987654321',
      appointmentHistory: ['2021-09-15', '2022-10-10']
      
    });

    // Simular uma resposta de sucesso
    req.flush({ message: 'Patient added successfully' });

    // Verificar se o Swal foi chamado com sucesso
    expect(swalSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'success',
      title: 'Patient adicionado com sucesso!',
      toast: true,
      position: 'top-end',
      timer: 3000,
      showConfirmButton: false
    }));

    // Verificar se o formulário foi resetado e o array limpo
    expect(component.myForm.pristine).toBeTrue();
    expect(component.appointmentHistory.length).toBe(0);
  });



  it('should open the view patient type modal', () => {
    component.isModalOpen = () => true;

    component.openModal('viewPatientModal');
    fixture.detectChanges();

    const modal = fixture.nativeElement.querySelector('#viewPatientModal');
    expect(modal).toBeTruthy();
    expect(modal.style.display).toBe('block');
  });

  it('should close the view patient modal', () => {
    component.openModal('viewPatientModal');
    fixture.detectChanges();

    component.closeModal('viewPatientModal');
    fixture.detectChanges();

    const modal = fixture.nativeElement.querySelector('#viewPatientModal');
    expect(modal).toBeTruthy();
    expect(modal.style.display).toBe('none');
  });

  it('should submit the patient form successfully', async () => {
    component.isModalOpen = () => true;
    fixture.detectChanges();

    component.onSubmit();
    fixture.detectChanges();

    fixture.whenStable().then(() => { const successMessage = fixture.nativeElement.querySelector('.form-submission-message'); expect(successMessage).toBeNull();
    expect(successMessage.textContent).toContain('Form Submitted!'); });
  });


  it('should show error message if no token is present', () => {
    spyOn(Swal, 'fire');

    component.editPatient();

    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'warning',
      title: 'Por favor seleciona um Patient.',
      toast: true,
      position: 'top-end',
      timer: 3000,
      showConfirmButton: false
    }));

  });



  it('should show warning if no patient email is selected', () => {

    component.selectedPatientEmail = null;

    spyOn(Swal, 'fire');

    component.editPatient();

    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: "warning",
      title: "Por favor seleciona um Patient.",
      toast: true,
      position: "top-end",
      timer: 3000,
      showConfirmButton: false
    }));
  });



  it('should fetch patient profile and open modal if patient email is selected', () => {
    const mockPatientResponse = {
      id: "341736fd-0291-4b7f-bede-63f7723cc6e0",
      name: {
        "firstName": "patient",
        "middleNames": "",
        "lastName": "patient"
      },
      email: {
        "fullEmail": "avlismana@gmail.com"
      },
      userEmail: {
        "fullEmail": "avlismana@gmail.com"
      },
      phone: {
        "number": "966783434"
      },
      gender: "Female",
      nameEmergency: "default dd",
      emailEmergency: {
        "fullEmail": "default@gmail.com"
      },
      phoneEmergency: {
        "number": "999999999"
      },   
      dateOfBirth: "1994-11-19T17:23:59.346839"
     };
    spyOn(component, 'populateUpdateForm');
    spyOn(component, 'openModal');

    component.selectedPatientEmail = 'avlismana@gmail';

    component.editPatient();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/Patients/email/${component.selectedPatientEmail}`);
    expect(req.request.method).toBe('GET');

    req.flush(mockPatientResponse);

    expect(component.populateUpdateForm).toHaveBeenCalled();
    expect(component.openModal).toHaveBeenCalledWith('UpdatePatientModal');
  });



});
