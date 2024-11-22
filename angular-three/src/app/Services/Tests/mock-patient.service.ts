import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { PatientService } from '../patient.service';
//import { Patient } from '../../pages/Patient/patient/patient.model';

@Injectable({
  providedIn: 'root'
})
export class MockPatientService extends PatientService{

 
  public mockPatient = {
    id: "11111111111",
    name: {
      firstName: 'John',
      middleNames: 'Michael',
      lastName: 'Doe'
    },
    dateOfBirth: '1990-01-01',
    medicalRecordNumber: 123456,
    email:'johndoe@example.com',
    userEmail: 'johndoe@example.com',
    phone: {
      number: '123456789'
    },
    gender: 'Male',
    emergencyContactName: 'Jane Doe',
    emergencyContactEmail:  'janedoe@example.com'
    ,
    emergencyContactPhone: {
      number: '987654321'
    },
    appointmentHistory: ['2023-11-01', '2023-11-10'],
    allergies: ['Peanuts', 'Dust'],
  };
  
  override getPatientByEmail(email: string | undefined): Observable<any> {
    if (email === 'johndoe@example.com') {
      return of(this.mockPatient);
    }
    return throwError(() => new Error('Patient not found'));
  }

  override updatePatient(email: string | undefined, data: any): Observable<any> {
    if (email === 'johndoe@example.com') {
      // Simulate a successful update
      return of('Patient updated successfully');
    }
    return throwError(() => new Error('Failed to update patient'));
  }

  override deactivatePatient(email: string | undefined): Observable<any> {
    if (email === 'johndoe@example.com') {
      // Simulate a successful deactivation
      return of('Patient deactivated successfully');
    }
    return throwError(() => new Error('Failed to deactivate patient'));
  }

  override confirmAction(actionId: string, email: string): Observable<any> {
    if (actionId && email === 'johndoe@example.com') {
      return of('Action confirmed successfully');
    }
    return throwError(() => new Error('Failed to confirm action'));
  }

  override confirmDeactivateAction(actionId: string): Observable<any> {
    if (actionId) {
      return of('Deactivation confirmed successfully');
    }
    return throwError(() => new Error('Failed to confirm deactivation'));
  }
}