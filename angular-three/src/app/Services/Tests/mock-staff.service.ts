import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MockStaffService {
  private staff = [
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
  ];

  viewStaff(id: string): Observable<any> {
    const staffProf = this.staff.find((p) => p.id === id);
    return staffProf ? of(staffProf) : throwError(() => new Error('Staff not found'));
  }

  createStaff(formData: any): Observable<any> {
    const newStaff = {
      ...formData,
      id: String(Date.now()), // Assign a mock ID
    };
    this.staff.push(newStaff);
    return of(newStaff); // Return the newly created patient
  }

  editStaffPostA(id: string, updatedData: any): Observable<any> {
    const staffIndex = this.staff.findIndex((p) => p.id === id);
    if (staffIndex !== -1) {
      this.staff[staffIndex] = {
        ...this.staff[staffIndex],
        ...updatedData,
      };
      return of(this.staff[staffIndex]); // Return the updated patient
    }
    return throwError(() => new Error('Staff not found'));
  }


  editStaffPostB(id: string, updatedData: any): Observable<any> {
    const staffIndex = this.staff.findIndex((p) => p.id === id);
    if (staffIndex !== -1) {
      this.staff[staffIndex].slots = {
        ...this.staff[staffIndex].slots,
        ...updatedData,
      };
      return of(this.staff[staffIndex]); // Return the updated patient
    }
    return throwError(() => new Error('Staff not found'));
  }

  deactivateStaff(selectedPatientEmail: string): Observable<any> {
    const staffIndex = this.staff.findIndex((p) => p.email.fullEmail === selectedPatientEmail);
    if (staffIndex !== -1) {
      //this.staff.splice(patientIndex, 1); // Remove the patient
      this.staff[staffIndex].active = false;
      return of({}); // Return success
    }
    return throwError(() => new Error('Staff not found'));
  }

  confirmDeactivateAction(actionId: string): Observable<any> {
    // Example implementation that simulates confirming a deactivation
    return of({ message: 'Deactivation confirmed for actionId: ' + actionId });
  }
}
