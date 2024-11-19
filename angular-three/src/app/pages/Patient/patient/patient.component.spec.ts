import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PatientComponent } from './patient.component';
import { MockPatientService } from '../../../Services/Tests/mock-patient.service';
import { AuthService } from '../../../Services/auth.service';
import { PatientService } from '../../../Services/patient.service';
import { ModalService } from '../../../Services/modal.service'; 
import { ActivatedRoute } from '@angular/router'; 
import Swal from 'sweetalert2';
import { MockModalService } from '../../../Services/Tests/mock-modal.service';

describe('PatientComponent', () => {
  let component: PatientComponent;
  let fixture: ComponentFixture<PatientComponent>;
  let mockPatientService: MockPatientService;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let modalService: ModalService;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getToken', 'getEmail', 'logout']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true, value: 'mock-code' } as any));

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule, PatientComponent],
      providers: [
        { provide: PatientService, useClass: MockPatientService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ModalService, useClass: MockModalService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientComponent);
    component = fixture.componentInstance;

    mockPatientService = TestBed.inject(MockPatientService);
    modalService = TestBed.inject(ModalService);
    modalService = new ModalService();

    mockAuthService.getToken.and.returnValue('mock-token');
    mockAuthService.getEmail.and.returnValue('johndoe@example.com');

    fixture.detectChanges();
  });



  it('should call isModalOpen on the MockModalService', async () => {
    const modalId = 'test-modal';
    spyOn(modalService, 'isModalOpen').and.callThrough();

    modalService.openModal(modalId);
    expect(modalService.isModalOpen(modalId)).toBeTrue();

    expect(modalService.isModalOpen).toHaveBeenCalledWith(modalId);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should redirect to login if no token is present', async () => {
      mockAuthService.getToken.and.returnValue(null);

      component.ngOnInit();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should call viewPatient if token is present', async () => {
      spyOn(component, 'viewPatient');
      mockAuthService.getToken.and.returnValue('mock-token');

      component.ngOnInit();

      expect(component.viewPatient).toHaveBeenCalled();
    });
  });

  describe('ModalService Integration', () => {
    it('should open and close modal properly', () => {
      const modalId = 'test-modal';
      console.log(modalService);

      modalService.openModal(modalId);
      expect(modalService.isModalOpen(modalId)).toBeTrue();

      modalService.closeModal(modalId);
      expect(modalService.isModalOpen(modalId)).toBeFalse();
    });
  });

  describe('viewPatient', () => {
    it('should set patientProfileSingle and populate the form on success', () => {
      mockAuthService.getToken.and.returnValue('mock-token');
      mockAuthService.getEmail.and.returnValue('johndoe@example.com');

      component.viewPatient();

      expect(component.patientProfileSingle).toEqual(mockPatientService.mockPatient);
      expect(component.patientUpdateForm.value.name).toContain('John Doe');
    });

    it('should handle error when patient is not found', () => {
      mockAuthService.getToken.and.returnValue('mock-token');
      mockAuthService.getEmail.and.returnValue('invalid@example.com');

      component.viewPatient();

      expect(component.errorMessage).toEqual('Failed to view patient profile!');
    });

    it('should not throw an error when patientProfileSingle is null', () => {
      component.patientProfileSingle = null; // Simulate uninitialized state
      expect(() => fixture.detectChanges()).not.toThrow();
    });
  });

  describe('onUpdatePatient', () => {
    it('should update patient data and show success message', fakeAsync(() => {
      mockAuthService.getToken.and.returnValue('mock-token');
      mockAuthService.getEmail.and.returnValue('johndoe@example.com');
      component.selectedPatientEmail = 'johndoe@example.com';
      component.patientUpdateForm.patchValue({ name: 'Updated Name', email: 'updated@example.com' });

      spyOn(window, 'alert'); // Mock alert for simplicity

      component.onUpdatePatient();
      tick();

      expect(window.alert).toHaveBeenCalledWith('Patient updated successfully');
    }));

    it('should handle update error', fakeAsync(() => {
      mockAuthService.getToken.and.returnValue('mock-token');
      mockAuthService.getEmail.and.returnValue('johndoe@example.com');
      spyOn(mockPatientService, 'updatePatient').and.returnValue(throwError(() => new Error('Update failed')));

      component.onUpdatePatient();
      tick();

      expect(component.errorMessage).toEqual('An error occurred while updating the patient.');
    }));
  });

  describe('deactivatePatient', () => {
    it('should deactivate patient and show success message', fakeAsync(() => {
      mockAuthService.getToken.and.returnValue('mock-token');
      mockAuthService.getEmail.and.returnValue('johndoe@example.com');
      component.selectedPatientEmail = 'johndoe@example.com';

      spyOn(window, 'alert'); 

      component.deactivatePatient();
      tick();

      expect(window.alert).toHaveBeenCalledWith('Patient deleted successfully.');
    }));

    it('should handle deactivation error', fakeAsync(() => {
      mockAuthService.getToken.and.returnValue('mock-token');
      mockAuthService.getEmail.and.returnValue('johndoe@example.com');
      spyOn(mockPatientService, 'deactivatePatient').and.returnValue(throwError(() => new Error('Deactivation failed')));

      component.deactivatePatient();
      tick();

      expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'error', title: 'Erro' }));
    }));
  });
});
