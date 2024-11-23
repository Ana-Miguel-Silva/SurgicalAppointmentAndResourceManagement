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

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mock_service;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserComponent],
      providers: [
        FormBuilder,
        { provide: PatientService, useClass: MockPatientService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: ActivatedRoute },
      ]      
    })
    .compileComponents();

    mock_service = TestBed.inject(PatientService) as MockPatientService;

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
