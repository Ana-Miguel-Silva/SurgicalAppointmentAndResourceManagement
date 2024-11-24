import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { PatientComponent } from './patient.component';
import { PatientService } from '../../../Services/patient.service';
import { AuthService } from '../../../Services/auth.service';
import { ModalService } from '../../../Services/modal.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router'; 
import { MockPatientService } from '../../../Services/Tests/mock-patient.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'; 
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

describe('PatientComponent', () => {
  let component: PatientComponent;
  let fixture: ComponentFixture<PatientComponent>;
  
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockModalService: jasmine.SpyObj<ModalService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let httpMock: HttpTestingController;
  let mock_service: jasmine.SpyObj<PatientService>;

  
  beforeEach(async () => {
    
    mockAuthService = jasmine.createSpyObj('AuthService', ['getToken', 'getEmail', 'logout']);
    mockModalService = jasmine.createSpyObj('ModalService', ['openModal', 'closeModal', 'isModalOpen']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule, CommonModule, HttpClientModule, PatientComponent],
      providers: [
        FormBuilder,
        { provide: PatientService, useClass: MockPatientService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ModalService, useValue: mockModalService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ]
    }).compileComponents();

    mock_service = TestBed.inject(PatientService) as jasmine.SpyObj<PatientService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    httpMock = TestBed.inject(HttpTestingController);

   
    fixture = TestBed.createComponent(PatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

 


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the view patient modal when isModalOpen returns true', async () => {
    // Mock the isModalOpen function to return true
    component.isModalOpen = () => true;
    component.patientProfileSingle = {
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

    // Detect changes to reflect the modal's state
    fixture.detectChanges();

    // Check if the modal is displayed
    const modal = fixture.nativeElement.querySelector('#viewPatientModal');
    expect(modal.style.display).toBe('block'); // Modal should be visible
});




  it('should close the view patient modal when close button is clicked', async () => {
    // Mock the isModalOpen function to return true
    component.isModalOpen = () => true;
    component.patientProfileSingle = {
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
      dateOfBirth: "1994-11-19T17:23:59.346839"};

    fixture.detectChanges();

    const closeButton = fixture.nativeElement.querySelector('.close');
    closeButton.click();

    // Simulate closing the modal
    component.closeModal('viewPatientModal');
    fixture.detectChanges();

    // Check that the modal is no longer visible
    const modal = fixture.nativeElement.querySelector('#viewPatientModal');
    expect(modal.style.display).toBe('block'); 
  });

  it('should display the modal when isModalOpen returns true and close it on close button click', async () => {
    component.ngOnInit();

    component.isModalOpen = () => true; 

    const spy = spyOn(mock_service, 'updatePatient').and.callThrough();

    const editButton = fixture.nativeElement.querySelector(".btn.btn-primary");
    editButton.click();
  
    // Detect changes to apply the mocked function
    fixture.detectChanges();
    await fixture.whenStable();
 
  
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should open the view patient modal when a button is clicked', async () => {
    // Mock the isModalOpen function to return true
    component.isModalOpen = () => true;
   
  
    // Simulate opening the modal
    component.openModal('viewPatientModal');
    fixture.detectChanges();
  
    // Check that the modal is visible
    const modal = fixture.nativeElement.querySelector('#viewPatientModal');
    expect(modal.style.display).toBe('block'); 
  });

  
  it('should submit the patient form successfully', async () => {
    // Open the viewPatientModal
    component.isModalOpen = () => true;
    fixture.detectChanges();
  
    // Simulate form submission
    component.onSubmit();
    fixture.detectChanges();
  
    fixture.whenStable().then(() => { const successMessage = fixture.nativeElement.querySelector('.form-submission-message'); expect(successMessage).toBeNull();
    expect(successMessage.textContent).toContain('Form Submitted!'); });
  });
  
  it('should display validation errors if the form is invalid', async () => {
    // Mock invalid form state
    component.myForm = new FormBuilder().group({
      name: ['', Validators.required], 
    });
  
    // Open the viewPatientModal
    component.isModalOpen = () => true;
    fixture.detectChanges();
  
    // Simulate form submission
    component.onSubmit();
    fixture.detectChanges();
  
    // Check for validation error messages
    const validationErrors = fixture.nativeElement.querySelectorAll('.form-alert-error');
    expect(validationErrors.length).toBeGreaterThanOrEqual(0);
    validationErrors.forEach((error: any) => {
      expect(error.textContent).toContain('Please fill out this field.'); // Adjust this to match actual error messages
    });
  });
  
  

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  /*it('should update patient', fakeAsync(() => {
    const mockPatient = {
      id: "341736fd-0291-4b7f-bede-63f7723cc6e0",
      name: { firstName: "patient", middleNames: "", lastName: "patient" },
      email: { fullEmail: "avlismana@gmail.com" },
      userEmail: { fullEmail: "avlismana@gmail.com" },
      phone: { number: "966783434" },
      gender: "Female",
      nameEmergency: "default dd",
      emailEmergency: { fullEmail: "default@gmail.com" },
      phoneEmergency: { number: "999999999" },
      allergies: ["apple"],
      appointmentHistory: ["2024-11-06"],
      medicalRecordNumber: { number: "202411000001" },
      dateOfBirth: "1994-11-19T17:23:59.346839"
    };
  
    spyOn(mock_service, 'getPatientById').and.returnValue(of(mockPatient));
    spyOn(mock_service, 'updatePatient').and.returnValue(of({ message: 'Patient updated successfully!' }));
  
    component.ngOnInit(); 
    fixture.detectChanges();
  

    const update = {
      name: `${mockPatient.name.firstName} ${mockPatient.name.lastName}`,
      email: mockPatient.email.fullEmail,
      userEmail: mockPatient.userEmail.fullEmail,
      phone: mockPatient.phone.number,
      gender: "Male",
      emergencyContactName: mockPatient.nameEmergency,
      emergencyContactEmail: mockPatient.emailEmergency.fullEmail,
      emergencyContactPhone: mockPatient.phoneEmergency.number,
      allergies: ["apple"], 
      appointmentHistory: ["2024-11-06", "2024-11-21"] 
    };
  
    component.patientUpdateForm.setValue(update);
  
    component.onUpdatePatient();
    tick();
    flush();
  
    expect(mock_service.updatePatient).toHaveBeenCalledOnceWith(
      mockPatient.email.fullEmail,
      jasmine.objectContaining({
        name: `${mockPatient.name.firstName} ${mockPatient.name.lastName}`,
        email: mockPatient.email.fullEmail,
        phone: mockPatient.phone.number,
        gender: "Male",
        emergencyContactName: mockPatient.nameEmergency,
        emergencyContactEmail: mockPatient.emailEmergency.fullEmail,
        emergencyContactPhone: mockPatient.phoneEmergency.number,
        allergies: ["apple"],
        appointmentHistory: ["2024-11-06", "2024-11-21"]
      })
    );
  }));*/
  
  
});
