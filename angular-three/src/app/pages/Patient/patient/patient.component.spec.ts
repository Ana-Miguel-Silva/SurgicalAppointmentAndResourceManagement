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
  let mockPatientService: jasmine.SpyObj<PatientService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockModalService: jasmine.SpyObj<ModalService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockPatientService = jasmine.createSpyObj('PatientService', ['getPatientByEmail', 'updatePatient', 'deactivatePatient']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getToken', 'getEmail', 'logout']);
    mockModalService = jasmine.createSpyObj('ModalService', ['openModal', 'closeModal', 'isModalOpen']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule, CommonModule, HttpClientModule, PatientComponent],
      providers: [
        FormBuilder,
        { provide: PatientService, useValue: mockPatientService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ModalService, useValue: mockModalService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    component.patientProfileSingle = {
      name: {
        firstName: 'John',
        middleNames: 'Michael',
        lastName: 'Doe'
      },
      dateOfBirth: '1990-01-01',
      medicalRecordNumber: 123456,
      email: 'johndoe@example.com',
      userEmail: 'johndoe@example.com',
      phone: {
        number: '123456789'
      },
      gender: 'Male',
      emergencyContactName: 'Jane Doe',
      emergencyContactEmail: 'janedoe@example.com',
      emergencyContactPhone: {
        number: '987654321'
      },
      appointmentHistory: ['2023-11-01', '2023-11-10'],
      allergies: ['Peanuts', 'Dust'],
    };

    mockAuthService.getToken.calls.reset();
    mockAuthService.getEmail.calls.reset();
    mockAuthService.logout.calls.reset();
    mockRouter.navigate.calls.reset();
    mockPatientService.getPatientByEmail.calls.reset();
    mockPatientService.updatePatient.calls.reset();
    mockPatientService.deactivatePatient.calls.reset();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get patient by email on init', () => {
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
  });
});
