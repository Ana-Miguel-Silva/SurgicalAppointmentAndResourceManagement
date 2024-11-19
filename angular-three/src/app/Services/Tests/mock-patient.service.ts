import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { PatientService } from '../patient.service';

@Injectable({
  providedIn: 'root'
})
export class MockPatientService {

  public mockPatient = {
    name: 'John Doe',
    email: {
      fullEmail: 'johndoe@example.com',
    },
    phone: {
      number: '123456789',
    },
    userEmail: {
      fullEmail: 'johndoe_user@example.com',
    },
    gender: 'Male',
    nameEmergency: 'Jane Doe',
    emailEmergency: {
      fullEmail: 'janedoe@example.com',
    },
    phoneEmergency: {
      number: '987654321',
    },
    appointmentHistory: ['2023-11-01', '2023-11-10'],
    allergies: ['Peanuts', 'Dust'],
  };

  getPatientByEmail(email: string | undefined): Observable<any> {
    if (email === 'johndoe@example.com') {
      return of(this.mockPatient);
    }
    return throwError(() => new Error('Patient not found'));
  }

  updatePatient(email: string | undefined, data: any): Observable<any> {
    if (email === 'johndoe@example.com') {
      // Simulate a successful update
      return of('Patient updated successfully');
    }
    return throwError(() => new Error('Failed to update patient'));
  }

  deactivatePatient(email: string | undefined): Observable<any> {
    if (email === 'johndoe@example.com') {
      // Simulate a successful deactivation
      return of('Patient deactivated successfully');
    }
    return throwError(() => new Error('Failed to deactivate patient'));
  }

  confirmAction(actionId: string, email: string): Observable<any> {
    if (actionId && email === 'johndoe@example.com') {
      return of('Action confirmed successfully');
    }
    return throwError(() => new Error('Failed to confirm action'));
  }

  confirmDeactivateAction(actionId: string): Observable<any> {
    if (actionId) {
      return of('Deactivation confirmed successfully');
    }
    return throwError(() => new Error('Failed to confirm deactivation'));
  }
}