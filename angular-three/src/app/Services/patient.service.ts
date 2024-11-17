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

    return this.http.get<Patient>(`${this.apiUrl}/Patients/${id}`, { headers });
}



getPatientByEmail(email: string): Observable<Patient> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.get<Patient>(`${this.apiUrl}/Patients/email/${email}`, { headers });
}




registerPatient(formData: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/users/registerPatient`, formData);
}

updatePatient(selectedPatientEmail: string, updatedData: any): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.patch(
    `${this.apiUrl}/Patients/${selectedPatientEmail}`,
    updatedData,
    { headers, responseType: 'text' }
  );
}

confirmAction(actionId: string, selectedPatientEmail: string): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.patch(
    `${this.apiUrl}/Patients/${actionId}/${selectedPatientEmail}`,
    {},
    { headers }
  );
}

deactivatePatient(selectedPatientEmail: string): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.delete(
    `${this.apiUrl}/Patients/${selectedPatientEmail}/delete`,
    { headers, responseType: 'text' }
  );
}

confirmDeactivateAction(actionId: string): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.delete(
    `${this.apiUrl}/Patients/${actionId}/deleteConfirmed`,
    { headers }
  );
}





}