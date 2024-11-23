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

// Create the mock service for AuthService
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
    // Create spy objects for dependencies
    mockModalService = jasmine.createSpyObj('ModalService', ['openModal', 'closeModal', 'isModalOpen']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    
    // Set up the TestBed configuration
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, 
        FormsModule, 
        CommonModule, 
        DoctorComponent // Import your component
      ],
      providers: [
        { provide: OperationRequestsService, useClass: MockOperationRequestsService },  // Use the mock service
        { provide: AuthService, useClass: MockAuthService },  // Use the mock service
        { provide: ModalService, useValue: mockModalService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    // Inject the mock service and create the component
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
    // Trigger ngOnInit
    component.ngOnInit();
    fixture.detectChanges();
    tick(); // Simulate async passage of time
  

    expect(mockAuthService.getToken).toHaveBeenCalled();
    expect(mockOperationRequestsService.getAllOperationRequests).toHaveBeenCalled();
    // Ensure the operation requests were loaded
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

    // Simulate the passage of time for async operations
    tick(500);  // You can increase the time to make sure everything is flushed

    // Flush any pending HTTP requests
    flush();

    // Verify mocks were called
    expect(mockAuthService.getToken).toHaveBeenCalled();
    expect(mockOperationRequestsService.createOperationRequests).toHaveBeenCalledWith(newRequest);
    expect(mockOperationRequestsService.getAllOperationRequests).toHaveBeenCalled();

    // Ensure the operation request was added
    expect(component.operationRequests.length).toBe(1);
  }));

  

  it('should update operation request and display success message', fakeAsync(() => {
    // Mock dependencies
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
  
    // Initialize component state
    component.operationRequests = [request];
  
    const updatedRequest = {
      id: '1',
      deadline: '2024-12-15',
      priority: 'Low', // Update priority
    };
  
    // Call onUpdateRequest
    component.onUpdateRequest(updatedRequest);
  
    tick(); // Simulate async passage of time
  
    // Flush any pending HTTP requests
    flush();
  
    // Verify mocks were called
    expect(mockAuthService.getToken).toHaveBeenCalled();
    expect(mockOperationRequestsService.updateOperationRequests).toHaveBeenCalledWith(updatedRequest);
    expect(mockOperationRequestsService.getAllOperationRequests).toHaveBeenCalled();
  
    // Verify updated request in component
    const updatedItem = component.operationRequests.find(req => req.id === '1');
    expect(updatedItem?.priority).toBe('Low');
  }));
  

  it('should delete operation request and display success message', fakeAsync(() => {
    // Sample request to delete
    const request = {
      id: '1',
      operationTypeName: 'Heart Surgery',
      emailDoctor: 'doctor@example.com',
      emailPatient: 'patient@example.com',
      deadline: '2024-12-15',
      priority: 'Urgent',
    };
  
    // Initialize component state
    component.operationRequests = [request];
  
    // Mock the deleteOperationRequests method
    spyOn(mockOperationRequestsService, 'deleteOperationRequests').and.returnValue(of({}));
  
    // Mock getAllOperationRequests to return an empty array after deletion
    spyOn(mockOperationRequestsService, 'getAllOperationRequests').and.returnValue(of([]));
  
    // Spy on the getToken method of mockAuthService
    spyOn(mockAuthService, 'getToken').and.returnValue('fake-token');
  
    // Call onDeleteRequest method
    component.onDeleteRequest(request.id);
  
    // Simulate the passage of time for async operations
    tick(500);  // Allow async code to complete
  
    // Flush any pending HTTP requests
    flush();
  
    // Verify deleteOperationRequests was called
    expect(mockOperationRequestsService.deleteOperationRequests).toHaveBeenCalledWith(request.id);
  
    // Ensure operationRequests is empty
    expect(component.operationRequests.length).toBe(0); // Now the test should pass
  }));

    it('should apply filter correctly', () => {
    // Set a filter and check if it applies correctly
    component.filter.priority = 'Urgent';
    component.applyFilter();

    expect(component.filteredRequests.length).toBeGreaterThan(0);
  });
});
