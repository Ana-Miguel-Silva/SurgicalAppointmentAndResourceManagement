import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MockPatientService {
  private patients = [
    {
      
        id: "341736fd-0291-4b7f-bede-63f7723cc6e0",
        name: {
          "firstName": "patient",
          "middleNames": "",
          "lastName": "patient"
        },
        email: { 
          "fullEmail": "avlismana@gmail.com" 
        },
        userEmail: { 
          "fullEmail": "avlismana@gmail.com" 
        },
        phone: { 
          "number": "966783434" 
        },
        gender: "Female",
        nameEmergency: "default dd",
        emailEmergency: { 
          "fullEmail": "default@gmail.com" 
        },
        phoneEmergency: { 
          "number": "999999999" 
        },
       allergies: ["apple"],
        appointmentHistory: ["2024-11-06"],
        medicalRecordNumber: { 
          "number": "202411000001" 
        },
        dateOfBirth: "1994-11-19T17:23:59.346839"
      
    },
  ];

  getAllPatients(params: any): Observable<any[]> {   
    return of(this.patients); 
  }
   


  getPatientById(id: string): Observable<any> {
    const patient = this.patients.find((p) => p.id === id);
    return patient ? of(patient) : throwError(() => new Error('Patient not found'));
  }

  getPatientByEmail(email: string): Observable<any> {
    const patient = this.patients.find((p) => p.email.fullEmail === email);
    return patient ? of(patient) : throwError(() => new Error('Patient not found'));
  }

  registerPatient(formData: any): Observable<any> {
    const newPatient = {
      ...formData,
      id: String(Date.now()), // Assign a mock ID
    };
    this.patients.push(newPatient);
    return of(newPatient); // Return the newly created patient
  }

  updatePatient(selectedPatientEmail: string, updatedData: any): Observable<any> {
    const patientIndex = this.patients.findIndex((p) => p.email.fullEmail === selectedPatientEmail);
    if (patientIndex !== -1) {
      this.patients[patientIndex] = {
        ...this.patients[patientIndex],
        ...updatedData,
      };
      return of(this.patients[patientIndex]); // Return the updated patient
    }
    return throwError(() => new Error('Patient not found'));
  }

  confirmAction(actionId: string, selectedPatientEmail: string): Observable<any> {
    // Example implementation that simulates confirming an action
    return this.getPatientByEmail(selectedPatientEmail);
  }

  deactivatePatient(selectedPatientEmail: string): Observable<any> {
    const patientIndex = this.patients.findIndex((p) => p.email.fullEmail === selectedPatientEmail);
    if (patientIndex !== -1) {
      this.patients.splice(patientIndex, 1); // Remove the patient
      return of({}); // Return success
    }
    return throwError(() => new Error('Patient not found'));
  }

  confirmDeactivateAction(actionId: string): Observable<any> {
    // Example implementation that simulates confirming a deactivation
    return of({ message: 'Deactivation confirmed for actionId: ' + actionId });
  }
}
