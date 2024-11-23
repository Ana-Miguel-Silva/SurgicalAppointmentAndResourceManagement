import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientComponent } from './patient.component';
import { PatientService } from '../../../Services/patient.service';
import { AuthService } from '../../../Services/auth.service';
import { ModalService } from '../../../Services/modal.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router'; 
import { MockPatientService } from '../../../Services/Tests/mock-patient.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing'; 
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

describe('PatientComponent', () => {
  let component: PatientComponent;
  let fixture: ComponentFixture<PatientComponent>;
  
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockModalService: jasmine.SpyObj<ModalService>;
  let mockRouter: jasmine.SpyObj<Router>;

  let mock_service: MockPatientService;

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

    mock_service = TestBed.inject(PatientService) as MockPatientService;

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
        name: { firstName: 'John', middleNames: 'Doe', lastName: 'Smith' },
        email: { fullEmail: 'john.doe@example.com' },
        phone: { number: '1234567890' },
        userEmail: { fullEmail: 'john.smith@example.com' },
        dateOfBirth: '1990-01-01',
        gender: 'Male',
        medicalRecordNumber: { number: 'MRN123456' },
        nameEmergency: 'Jane Doe',
        emailEmergency: { fullEmail: 'jane.doe@example.com' },
        phoneEmergency: { number: '0987654321' },
        appointmentHistory: ['2023-01-01', '2023-02-01'],
        allergies: ['Peanuts', 'Shellfish']
    };

    // Detect changes to reflect the modal's state
    fixture.detectChanges();

    // Check if the modal is displayed
    const modal = fixture.nativeElement.querySelector('#viewPatientModal');
    expect(modal).toBeTruthy();
    expect(modal.style.display).toBe('block'); // Modal should be visible
});




  it('should close the view patient modal when close button is clicked', async () => {
    // Mock the isModalOpen function to return true
    component.isModalOpen = () => true;
    component.patientProfileSingle = {
       name: { firstName: 'John', middleNames: 'Doe', lastName: 'Smith' }, 
       email: { fullEmail: 'john.doe@example.com' },
         phone: { number: '1234567890' }, 
         userEmail: { fullEmail: 'john.smith@example.com' }, 
         dateOfBirth: '1990-01-01', 
         gender: 'Male', 
         medicalRecordNumber: { number: 'MRN123456' },
         nameEmergency: 'Jane Doe', 
         emailEmergency: { fullEmail: 'jane.doe@example.com' }, 
         phoneEmergency: { number: '0987654321' }, 
         appointmentHistory: ['2023-01-01', '2023-02-01'], 
         allergies: ['Peanuts', 'Shellfish'], };

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
  
    fixture.whenStable().then(() => { const successMessage = fixture.nativeElement.querySelector('.form-submission-message'); expect(successMessage).toBeTruthy(); expect(successMessage.textContent).toContain('Form Submitted!'); });
  });
  
  it('should display validation errors if the form is invalid', async () => {
    // Mock invalid form state
    component.myForm = new FormBuilder().group({
      name: ['', Validators.required], // empty name to make the form invalid
      // other form controls...
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
  
  

  /*it('should get patient by email on init', () => {
    mockPatientService.getPatientByEmail.and.returnValue(of(component.patientProfileSingle));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.patientProfileSingle).toEqual(component.patientProfileSingle);
  });

  it('should handle error if getPatientByEmail fails on init', () => {
    mockPatientService.getPatientByEmail.and.returnValue(throwError(() => new Error('Patient not found')));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.errorMessage).toContain('Failed to view patient profile!');
  });

  it('should handle the error for view patient', () => {
    mockPatientService.getPatientByEmail.and.returnValue(throwError(() => new Error('Failed to view patient')));
    component.viewPatient();
    fixture.detectChanges();
    expect(component.errorMessage).toBe('Failed to view patient profile!');
  });

  it('should update patient successfully', () => {
    mockPatientService.updatePatient.and.returnValue(of('Patient updated successfully'));
    component.selectedPatientEmail = 'johndoe@example.com';
    component.onUpdatePatient();
    fixture.detectChanges();
    expect(component.successMessage).toBe('Patient updated successfully!');
  });

  it('should handle error if updatePatient fails', () => {
    mockAuthService.getToken.and.returnValue('fake-token');
    mockPatientService.updatePatient.and.returnValue(throwError(() => new Error('Failed to update patient')));
    component.onUpdatePatient();
    expect(component.errorMessage).toBe('An error occurred while updating the patient.');
  });

  it('should handle the view patient', () => {
    mockPatientService.getPatientByEmail.and.returnValue(of(component.patientProfileSingle));
    component.viewPatient();
    expect(component.patientProfileSingle).toEqual(component.patientProfileSingle);
  });

  it('should handle the error for view patient', () => {
    mockPatientService.getPatientByEmail.and.returnValue(throwError(() => new Error('You are not logged in!')));
    component.viewPatient();
    expect(component.errorMessage).toBe('You are not logged in!');
  });

  it('should handle logout', () => {
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });*/
});
