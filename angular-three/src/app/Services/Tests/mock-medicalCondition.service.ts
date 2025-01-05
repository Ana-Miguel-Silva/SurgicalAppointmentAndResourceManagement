import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MedicalConditionService } from '../medicalCondition.service';

@Injectable()
export class MockMedicalConditionService extends MedicalConditionService{

  override createMedicalCondition(medicalCondition: any): Observable<any> {
    return of({ success: true, medicalCondition });
  }


  override updateMedicalCondition(id: any, operationRequest: any): Observable<any> {
    return of({ success: true, updatedMedicalCondition: { ...operationRequest, id } });
  }


  override getAllMedicalConditions(): Observable<any[]> {
    const mockConditions = [
      {
        codigo: 'MC01',
        designacao: 'Condition A',
        descricao: 'Description A',
        sintomas: 'Symptom A',
      },
      {
        codigo: 'MC02',
        designacao: 'Condition B',
        descricao: 'Description B',
        sintomas: 'Symptom B',
      },
    ];
    return of(mockConditions);
  }


  override viewMedicalCondition(id: any): Observable<any> {
    const mockCondition = {
      codigo: 'MC01',
      designacao: 'Condition A',
      descricao: 'Description A',
      sintomas: 'Symptom A',
    };
    return of(mockCondition);
  }
}
