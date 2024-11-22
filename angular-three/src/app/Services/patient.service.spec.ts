import { TestBed } from '@angular/core/testing';
import { PatientService } from './patient.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { AuthService } from './auth.service';

describe('PatientService', () => {
  let service: PatientService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  const mockAuthService = {
    getToken: jasmine.createSpy('getToken').and.returnValue('mock-token'),
  };

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'patch', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        PatientService,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: AuthService, useValue: mockAuthService },
      ],
    });
    service = TestBed.inject(PatientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getPatientById and return patient data', () => {
    const mockResponse = { id: '123', name: 'John Doe' };
    httpClientSpy.get.and.returnValue(of(mockResponse));

    service.getPatientById('123').subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(httpClientSpy.get).toHaveBeenCalledOnceWith('https://localhost:5001/Patients/123', {
        headers: jasmine.any(Object),
      });
    });
  });
});