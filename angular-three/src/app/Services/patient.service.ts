import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Patient } from '../pages/Patient/patient/patient.model'; // Crie um modelo de paciente conforme sua estrutura de dados


@Injectable({
  providedIn: 'root',
})

@Injectable()
export class PatientService {
  private apiUrl = 'https://localhost:5001/api/Patients'; // Altere para a URL do seu backend

  constructor(private http: HttpClient) {}

  getPatientById(id: string): Observable<Patient> {
    return this.http.get<Patient>(`https://localhost:5001/api/Patients/${id}`);
  }


}
