import { AdminComponent } from './admin.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../../../Services/auth.service';
import { MockOperationTypesService } from '../../../Services/Tests/mock-operationTypes.service';
import { MockStaffService } from '../../../Services/Tests/mock-staff.service';
import { OperationTypesService } from '../../../Services/operationTypes.service.';
import { StaffService } from '../../../Services/staff.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModalService } from '../../../Services/modal.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, tick, flush } from '@angular/core/testing';

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
  let mockRouter: jasmine.SpyObj<Router>;
  let httpMock: HttpTestingController;


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
        { provide: StaffService, useClass: MockStaffService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: ModalService, useValue: mockModalService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    mockOperationTypeService = TestBed.inject(OperationTypesService) as jasmine.SpyObj<OperationTypesService>;
    mockStaffService = TestBed.inject(StaffService) as jasmine.SpyObj<StaffService>;
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
  it('should call createStaff and display success message', fakeAsync(() => {
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
  }));
  it('should call editStaffPostA and display success message', fakeAsync(() => {
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
  }));
  it('should call deactivateStaff and display success message', fakeAsync(() => {
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
  }));

});
