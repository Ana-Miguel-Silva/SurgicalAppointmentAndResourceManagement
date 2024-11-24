import { AdminComponent } from './admin.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../../../Services/auth.service';
import { MockOperationTypesService } from '../../../Services/Tests/mock-operationTypes.service';
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

class MockAuthService {
  getToken() {
    return 'fake-token';
  }
}

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let mockOperationTypeService: jasmine.SpyObj<OperationTypesService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockModalService: jasmine.SpyObj<ModalService>;
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
        { provide: AuthService, useClass: MockAuthService },
        { provide: ModalService, useValue: mockModalService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    mockOperationTypeService = TestBed.inject(OperationTypesService) as jasmine.SpyObj<OperationTypesService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
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
      appointmentHistory: [],
      allergies: []
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
      appointmentHistory: ['2021-09-15', '2022-10-10'],
      allergies: []
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
      position: 'bottom-right', 
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
      position: "bottom-right",
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
     allergies: ["apple"],
      appointmentHistory: ["2024-11-06"],
      medicalRecordNumber: { 
        "number": "202411000001" 
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
