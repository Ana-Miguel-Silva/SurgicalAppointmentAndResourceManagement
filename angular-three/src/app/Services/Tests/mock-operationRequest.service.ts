import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { OperationRequestsService } from '../operationRequest.service';  // Replace with your actual import

@Injectable({
  providedIn: 'root',
})
export class MockOperationRequestsService {
  private operationRequests = [
    { id: '1', operationTypeName: 'Heart Surgery', emailDoctor: 'doctor@example.com', emailPatient: 'patient@example.com', deadline: '2024-12-15', priority: 'Urgent' },
    { id: '2', operationTypeName: 'Knee Replacement', emailDoctor: 'doctor2@example.com', emailPatient: 'patient2@example.com', deadline: '2024-11-20', priority: 'Low' },
  ];

  getAllOperationRequests(): Observable<any[]> {
    return of([...this.operationRequests]); // Return a copy of the array
  }

  createOperationRequests(newRequest: any): Observable<any> {
    const newRequestWithId = { ...newRequest, id: String(Date.now()) }; // Assign a mock ID
    this.operationRequests.push(newRequestWithId);
    return of(newRequestWithId); // Return the newly created request
  }

  updateOperationRequests(updatedRequest: any): Observable<any> {
    const index = this.operationRequests.findIndex(req => req.id === updatedRequest.id);
    if (index !== -1) {
      this.operationRequests[index] = { ...this.operationRequests[index], ...updatedRequest };
      return of(this.operationRequests[index]); // Return the updated request
    }
    return throwError(() => new Error('Request not found'));
  }

  deleteOperationRequests(id: string): Observable<any> {
    const index = this.operationRequests.findIndex(req => req.id === id);
    if (index !== -1) {
      this.operationRequests.splice(index, 1); // Remove the request
      return of({}); // Return success
    }
    return throwError(() => new Error('Request not found'));
  }
}

