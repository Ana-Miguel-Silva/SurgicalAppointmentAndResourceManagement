import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Patient } from '../pages/Patient/patient/patient.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})

@Injectable()
export class PatientService {
  private apiUrl = 'https://localhost:5001/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getPatientById(id: string): Observable<Patient> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Patient>(`https://localhost:5001/api/Patients/${id}`,{ headers });
  }


  


}
