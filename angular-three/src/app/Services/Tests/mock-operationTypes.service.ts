import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OperationTypesService } from '../operationTypes.service.';

@Injectable({
  providedIn: 'root',
})
export class MockOperationTypesService extends OperationTypesService {
  private operationTypes = [
    {},
  ];

  override createOperationTypes(newType: any): Observable<any> {
    const newTypeWithId = { ...newType, id: String(Date.now()) };
    this.operationTypes.push(newTypeWithId);
    return of(newTypeWithId);
  }

   getAllMockOperationTypes(): Observable<any[]> {
    return of([...this.operationTypes]);
  }

}
