import { AdminComponent } from './admin.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../../../Services/auth.service';
import { MockOperationTypesService } from '../../../Services/Tests/mock-operationTypes.service';
import { OperationTypesService } from '../../../Services/operationTypes.service.';
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
});
