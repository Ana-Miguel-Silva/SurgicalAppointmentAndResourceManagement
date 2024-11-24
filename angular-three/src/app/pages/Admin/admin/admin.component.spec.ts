import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { AuthService } from '../../../Services/auth.service';
import { ModalService } from '../../../Services/modal.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { OperationTypesService } from '../../../Services/operationTypes.service.';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockModalService: jasmine.SpyObj<ModalService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockOperationTypesService: jasmine.SpyObj<OperationTypesService>;

  beforeEach(async () => {
    // Correct initialization of spy objects
    mockModalService = jasmine.createSpyObj('ModalService', ['openModal', 'closeModal', 'isModalOpen']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getToken']);
    mockOperationTypesService = jasmine.createSpyObj('OperationTypesService', [
      'getAllOperationTypes',
      'createOperationTypes',
      'getSearchOperationTypes' // Fixed: no trailing space
    ]);
  
    // Mock return values for the spy methods
    mockOperationTypesService.getAllOperationTypes.and.returnValue(
      of([
        {
          id: '2889eef2-111f-4eec-90a3-d251a90f5c6f',
          Name: 'CARDIOLOGY',
          PatientPreparationDuration: '00:35:00',
          SurgeryDuration: '01:30:00',
          CleaningDuration: '00:45:00',
          Active: true,
        },
      ])
    );
  
    mockOperationTypesService.createOperationTypes.and.returnValue(of({ success: true }));
    mockOperationTypesService.getSearchOperationTypes.and.returnValue(
      of([
        {
          id: '2889eef2-111f-4eec-90a3-d251a90f5c6f',
          Name: 'CARDIOLOGY',
          PatientPreparationDuration: '00:35:00',
          SurgeryDuration: '01:30:00',
          CleaningDuration: '00:45:00',
          Active: true,
        },
      ])
    );
  
    mockAuthService.getToken.and.returnValue('fake-token');
  
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule, CommonModule, AdminComponent],
      declarations: [],
      providers: [
        { provide: OperationTypesService, useValue: mockOperationTypesService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ModalService, useValue: mockModalService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  
    // Initialize the component and fixture
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
  
    // Ensure mocks are properly set up before running lifecycle methods
    fixture.detectChanges();
  });


  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load operation types on init', fakeAsync(() => {
    // Trigger ngOnInit manually if needed
    component.ngOnInit();
    tick();

    // Expectations
    expect(mockAuthService.getToken).toHaveBeenCalled();
    expect(mockOperationTypesService.getAllOperationTypes).toHaveBeenCalled();
    expect(component.OperationTypesProfiles.length).toBe(1);
    expect(component.OperationTypesProfiles[0].Name).toBe('CARDIOLOGY');
  }));

  it('should create operation type', fakeAsync(() => {
    const newOperationType = {
      name: 'CARDIOLOGY',
      requiredStaff: [],
      estimatedDuration: {
        patientPreparation: '00:35:00',
        surgery: '01:30:00',
        cleaning: '00:45:00',
      },
    };

    // Mock the createOperationTypes method
    mockOperationTypesService.createOperationTypes.and.returnValue(of({ success: true }));

    // Call the method
    component.operationType = newOperationType;
    component.onCreateOperationType();
    tick();

    expect(mockOperationTypesService.createOperationTypes).toHaveBeenCalledWith(newOperationType);
    expect(component.OperationTypesProfiles.length).toBeGreaterThan(0); // Ensure it was added
  }));
});
