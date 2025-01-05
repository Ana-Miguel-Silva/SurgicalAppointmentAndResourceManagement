import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MockSpecializationService {
  private specializations = [
    { id: '1', name: 'Cardiology', description: 'Heart-related medical specialization' },
    { id: '2', name: 'Orthopedics', description: 'Bone and joint specialization' },
  ];

  createSpecialization(specialization: any): Observable<any> {
    const newSpecialization = { ...specialization, id: String(Date.now()) };
    this.specializations.push(newSpecialization);
    return of(newSpecialization);
  }

  getAllSpecializations(): Observable<any[]> {
    return of([...this.specializations]);
  }

  viewSpecialization(specializationId: string): Observable<any> {
    const specialization = this.specializations.find(spec => spec.id === specializationId);
    if (specialization) {
      return of(specialization);
    }
    return throwError(() => new Error('Specialization not found'));
  }

  updateSpecialization(specializationId: string, updatedData: any): Observable<any> {
    const index = this.specializations.findIndex(spec => spec.id === specializationId);
    if (index !== -1) {
      this.specializations[index] = { ...this.specializations[index], ...updatedData };
      return of(this.specializations[index]);
    }
    return throwError(() => new Error('Specialization not found'));
  }
}
