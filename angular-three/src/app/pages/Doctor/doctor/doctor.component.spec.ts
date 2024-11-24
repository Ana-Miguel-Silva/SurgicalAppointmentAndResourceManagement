import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoctorComponent } from './doctor.component';
import { MockOperationRequestsService } from '../../../Services/Tests/mock-operationRequest.service'; 
import { MockModalService } from '../../../Services/Tests/mock-modal.service';
import { ModalService } from '../../../Services/modal.service';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { OperationRequestsService } from '../../../Services/operationRequest.service';
import { fakeAsync, tick, flush } from '@angular/core/testing';


class MockAuthService {
  getToken() {
    return 'fake-token';
  }

  logout() {}
}

describe('DoctorComponent', () => {
  let component: DoctorComponent;
  let fixture: ComponentFixture<DoctorComponent>;
  
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockModalService: jasmine.SpyObj<ModalService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockOperationRequestsService: jasmine.SpyObj<OperationRequestsService>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
   
    mockModalService = jasmine.createSpyObj('ModalService', ['openModal', 'closeModal', 'isModalOpen']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    
   
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, 
        FormsModule, 
        CommonModule, 
        DoctorComponent
      ],
      providers: [
        { provide: OperationRequestsService, useClass: MockOperationRequestsService }, 
        { provide: AuthService, useClass: MockAuthService },
        { provide: ModalService, useValue: mockModalService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    mockOperationRequestsService = TestBed.inject(OperationRequestsService) as jasmine.SpyObj<OperationRequestsService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    httpMock = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(DoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('should load operation requests on init', fakeAsync(() => {

    spyOn(mockOperationRequestsService, 'getAllOperationRequests').and.returnValue(of([{ id: '1', priority: 'Urgent' }, { id: '2', priority: 'Low' }]));
    spyOn(mockAuthService, 'getToken').and.returnValue('fake-token');

    component.ngOnInit();
    fixture.detectChanges();
    tick(); 
  

    expect(mockAuthService.getToken).toHaveBeenCalled();
    expect(mockOperationRequestsService.getAllOperationRequests).toHaveBeenCalled();
    expect(component.operationRequests.length).toBe(2);
  }));


  it('should call createOperationRequests and display success message', fakeAsync(() => {
    spyOn(mockOperationRequestsService, 'createOperationRequests').and.returnValue(of({}));
    spyOn(mockOperationRequestsService, 'getAllOperationRequests').and.returnValue(of([{ id: '1', priority: 'Urgent' }]));
    spyOn(mockAuthService, 'getToken').and.returnValue('fake-token');

    const newRequest = {
      patientEmail: 'patient2@example.com',
      operationTypeName: 'Heart Surgery',
      deadline: '2024-12-15',
      priority: 'Urgent',
    };
  
component.onCreateRequest(newRequest);

    tick(500);  

    flush();

    expect(mockAuthService.getToken).toHaveBeenCalled();
    expect(mockOperationRequestsService.createOperationRequests).toHaveBeenCalledWith(newRequest);
    expect(mockOperationRequestsService.getAllOperationRequests).toHaveBeenCalled();

    expect(component.operationRequests.length).toBe(1);
  }));

  

  it('should update operation request and display success message', fakeAsync(() => {
    spyOn(mockOperationRequestsService, 'updateOperationRequests').and.callThrough();
    spyOn(mockOperationRequestsService, 'getAllOperationRequests').and.returnValue(of([
      { id: '1', deadline: '2024-12-15', priority: 'Low' },
    ]));
    spyOn(mockAuthService, 'getToken').and.returnValue('fake-token');
  
    const request = {
      id: '1',
      operationTypeName: 'Heart Surgery',
      emailDoctor: 'doctor@example.com',
      emailPatient: 'patient@example.com',
      deadline: '2024-12-15',
      priority: 'Urgent',
    };
  
    component.operationRequests = [request];
  
    const updatedRequest = {
      id: '1',
      deadline: '2024-12-15',
      priority: 'Low',
    };
  
    component.onUpdateRequest(updatedRequest);
  
    tick();
  
    flush();
  
    expect(mockAuthService.getToken).toHaveBeenCalled();
    expect(mockOperationRequestsService.updateOperationRequests).toHaveBeenCalledWith(updatedRequest);
    expect(mockOperationRequestsService.getAllOperationRequests).toHaveBeenCalled();
  
    const updatedItem = component.operationRequests.find(req => req.id === '1');
    expect(updatedItem?.priority).toBe('Low');
  }));
  

  it('should delete operation request and display success message', fakeAsync(() => {
    const request = {
      id: '1',
      operationTypeName: 'Heart Surgery',
      emailDoctor: 'doctor@example.com',
      emailPatient: 'patient@example.com',
      deadline: '2024-12-15',
      priority: 'Urgent',
    };
  
    component.operationRequests = [request];
  
    spyOn(mockOperationRequestsService, 'deleteOperationRequests').and.returnValue(of({}));
  
    spyOn(mockOperationRequestsService, 'getAllOperationRequests').and.returnValue(of([]));
  
    spyOn(mockAuthService, 'getToken').and.returnValue('fake-token');
  
    component.onDeleteRequest(request.id);
  
    tick(500);
  
    flush();
  
    expect(mockOperationRequestsService.deleteOperationRequests).toHaveBeenCalledWith(request.id);
  
    expect(component.operationRequests.length).toBe(0);
  }));

    it('should apply filter correctly', () => {
    component.filter.priority = 'Urgent';
    component.applyFilter();

    expect(component.filteredRequests.length).toBeGreaterThan(0);
  });

  it('should open the create request modal', () => {
    component.isModalOpen = () => true;  
    
    component.openModal('createRequestModal');
    fixture.detectChanges();
    
    const modal = fixture.nativeElement.querySelector('#createRequestModal');
    expect(modal).toBeTruthy();
    expect(modal.style.display).toBe('block');
  });

  it('should close the create request modal', () => {
    component.openModal('createRequestModal');
    fixture.detectChanges();

    component.closeModal('createRequestModal');
    fixture.detectChanges();

    const modal = fixture.nativeElement.querySelector('#createRequestModal');
    expect(modal).toBeTruthy();
    expect(modal.style.display).toBe('none');
  });

  it('should open the filter request modal', () => {
    component.isModalOpen = () => true

    component.openModal('filterRequestModal');
    fixture.detectChanges();
  
    const modal = fixture.nativeElement.querySelector('#filterRequestModal');
    expect(modal).toBeTruthy();
    expect(modal.style.display).toBe('block');
  });

  it('should open the update request modal', () => {
    component.isModalOpen = () => true

    component.openModal('updateRequestModal');
    fixture.detectChanges();
    const modal = fixture.nativeElement.querySelector('#updateRequestModal');
    expect(modal).toBeTruthy();
    expect(modal.style.display).toBe('block');
  });
});
