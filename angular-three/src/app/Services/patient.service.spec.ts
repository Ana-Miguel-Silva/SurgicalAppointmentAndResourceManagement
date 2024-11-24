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

 
});