import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PatientService } from '../../Services/patient.service';
import { ActivatedRoute } from '@angular/router';
import { UserComponent } from './user.component';
import { FormBuilder } from '@angular/forms';
import { MockPatientService } from '../../Services/Tests/mock-patient.service';
import { ModalService } from '../../Services/modal.service';
import { AuthService } from '../../Services/auth.service';
import { of } from 'rxjs';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockModalService: jasmine.SpyObj<ModalService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockPatientService: jasmine.SpyObj<PatientService>;

  beforeEach(async () => {
    // Correctly initialize the spy objects
    mockModalService = jasmine.createSpyObj('ModalService', ['openModal', 'closeModal', 'isModalOpen']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getToken', 'getEmail', 'logout']);
    mockPatientService = jasmine.createSpyObj('PatientService', ['getPatientByEmail', 'updatePatient', 'deactivatePatient', 'registerPatient']);

    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['queryParams']);
    activatedRouteSpy.queryParams = of({ email: '1221137@isep.ipp.pt' }); 
  
    // Mock the methods to return observables
    mockPatientService.getPatientByEmail.and.returnValue(of({}));
    mockPatientService.updatePatient.and.returnValue(of('Patient updated successfully'));
    mockPatientService.deactivatePatient.and.returnValue(of('Patient deactivated successfully'));
    mockPatientService.registerPatient.and.returnValue(of({}));
  
  
  
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, CommonModule, HttpClientModule],
      providers: [
        FormBuilder,
        { provide: PatientService, useValue: mockPatientService },
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ModalService, useValue: mockModalService },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    }).compileComponents();
  
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});
