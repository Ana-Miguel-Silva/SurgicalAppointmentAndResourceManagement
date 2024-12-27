import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { MedicalRecordService } from '../medicalRecordservice';

@Injectable({
  providedIn: 'root',
})
export class MockMedicalRecordService extends MedicalRecordService {
  private medicalRecords = [
    { id: '1', 
      staff: "937c43d0-85df-4cfc-b07b-b1b6c2af6501",
      patientId: "9b48129b-4e08-44bd-b714-a1fb730f3a19",
      allergies: [
        { designacao: "Peanut Allergy", descricao: "", status: "Active" },
        { designacao: "Shellfish Allergy", descricao: "e.g., shrimp, lobster", status: "Not Meaningful Anymore" }
      ],
      medicalConditions: [
        { codigo: "A04.0", designacao: "Cholera", descricao: "An acute diarrheal disease caused by Vibrio cholerae, often transmitted through contaminated water or food.", "sintomas": ["Severe diarrhea", "Dehydration", "Vomiting", "Muscle cramps"], status: "Active" },
        { codigo: "A08.0", designacao: "Rotavirus enteritis",   descricao: "A viral infection that causes severe diarrhea, primarily in young children.", "sintomas": ["Diarrhea", "Fever", "Abdominal pain", "Dehydration"], status: "Active" }
      ],
      descricao: [""]
    }
    ,
    { id: '2', 
      staff: "937c43d0-85df-4cfc-b07b-b1b6c2af6501",
      patientId: "9b48129b-4e08-44bd-b714-a1fb730f3a12",
      allergies: [
        { designacao: "Peanut Allergy", descricao: "", status: "Active" },
        { designacao: "Shellfish Allergy", descricao: "e.g., shrimp, lobster", status: "Active" }
      ],
      medicalConditions: [       
        { codigo: "A08.0", designacao: "Rotavirus enteritis",   descricao: "A viral infection that causes severe diarrhea, primarily in young children.", "sintomas": ["Diarrhea", "Fever", "Abdominal pain", "Dehydration"], status: "Active" }
      ],
      descricao: ["teste"]
    },
  ];

  override getAllMedicalRecord(): Observable<any[]> {
    return of([...this.medicalRecords]);
  }

  override createMedicalRecord(newRequest: any): Observable<any> {
    const newRequestWithId = { ...newRequest, id: String(Date.now()) };
    this.medicalRecords.push(newRequestWithId);
    return of(newRequestWithId);
  }

  override getAllMedicalRecordByPatientId(patientId : any):  Observable<any> {
    const records = this.medicalRecords.filter(record => record.patientId === patientId);
    return of(records);
  }

  override updateMedicalRecord(medicalRecord: any): Observable<any[]> {
    const index = this.medicalRecords.findIndex(req => req.id === medicalRecord.id);
    if (index !== -1) {
      this.medicalRecords[index] = { ...this.medicalRecords[index], ...medicalRecord };
      return of([this.medicalRecords[index]]);
    }
    return throwError(() => new Error('Medical Record not found'));
  }


}

