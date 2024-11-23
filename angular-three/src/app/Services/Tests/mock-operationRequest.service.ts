import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { OperationRequestsService } from '../operationRequest.service';

@Injectable({
  providedIn: 'root',
})
export class MockOperationRequestsService extends OperationRequestsService {
  private operationRequests = [
    { id: '1', operationTypeName: 'Heart Surgery', emailDoctor: 'doctor@example.com', emailPatient: 'patient@example.com', deadline: '2024-12-15', priority: 'Urgent' },
    { id: '2', operationTypeName: 'Knee Replacement', emailDoctor: 'doctor2@example.com', emailPatient: 'patient2@example.com', deadline: '2024-11-20', priority: 'Low' },
  ];

  override getAllOperationRequests(): Observable<any[]> {
    return of([...this.operationRequests]);
  }

  override createOperationRequests(newRequest: any): Observable<any> {
    const newRequestWithId = { ...newRequest, id: String(Date.now()) };
    this.operationRequests.push(newRequestWithId);
    return of(newRequestWithId);
  }

  override updateOperationRequests(updatedRequest: any): Observable<any> {
    const index = this.operationRequests.findIndex(req => req.id === updatedRequest.id);
    if (index !== -1) {
      this.operationRequests[index] = { ...this.operationRequests[index], ...updatedRequest };
      return of(this.operationRequests[index]);
    }
    return throwError(() => new Error('Request not found'));
  }

  override deleteOperationRequests(id: string): Observable<any> {
    const index = this.operationRequests.findIndex(req => req.id === id);
    if (index !== -1) {
      this.operationRequests.splice(index, 1);
      return of({});
    }
    return throwError(() => new Error('Request not found'));
  }
}

