import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { AllergiesService } from '../allergies.service';

@Injectable({
  providedIn: 'root',
})

export class MockAllergiesService extends AllergiesService {
  private mockAllergies = [
    { designacao: 'Pollen', descricao: 'Allergy to pollen' },
    { designacao: 'Peanuts', descricao: 'Allergy to peanuts' },
  ];

  override insertAllergies(params: any): Observable<any> {
    // Simular resposta ao adicionar alergia
    if (this.mockAllergies.some((a) => a.designacao === params.name)) {
      return throwError(() => new Error('Allergy already exists'));
    }
    const newAllergy = { id: this.mockAllergies.length + 1, ...params };
    this.mockAllergies.push(newAllergy);
    return of(newAllergy);
  }

  override getAllAllergies(): Observable<any[]> {
    // Retornar alergias fictícias
    return of(this.mockAllergies);
  }

  override getByDesignacao(designacao: string): Observable<any> {
    const result = this.mockAllergies.find((a) => a.designacao === designacao);
    return result ? of(result) : throwError(() => new Error('Allergy not found'));
  }


  override updateAllergie(designacao: string, updatedData: any): Observable<any> {
    // Simular atualização de alergia
    const allergyIndex = this.mockAllergies.findIndex((a) => a.designacao === designacao);
    if (allergyIndex === -1) {
      return throwError(() => new Error('Allergy not found'));
    }
    this.mockAllergies[allergyIndex] = {
      ...this.mockAllergies[allergyIndex],
      ...updatedData,
    };
    return of(this.mockAllergies[allergyIndex]);
  }
}