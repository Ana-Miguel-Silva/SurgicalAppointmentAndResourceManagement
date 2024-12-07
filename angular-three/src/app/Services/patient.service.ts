import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
//import { Patient } from '../pages/Patient/patient/patient.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrl = `${environment.apiBaseUrl}`;
  private patientUrl = `${environment.apiBaseUrl}/Patients`;

  constructor(private http: HttpClient, private authService: AuthService) {}

getPatientById(id: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    

    return this.http.get<any>(`${this.apiUrl}/Patients/${id}`, { headers });
}

getAllPatientProfiles(params: any): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.get<any[]>(`${this.apiUrl}/Patients/search`, { headers, params })

  //return this.http.get<any>(`${this.apiUrl}/Patients/${id}`, { headers });
}



getPatientByEmail(email: string): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.get<any>(`${this.apiUrl}/Patients/email/${email}`, { headers });
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





adminRegisterPatient(formData: any): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.post<any>(`${this.patientUrl}/register`, formData, { headers })
}


adminGetPatient(selectedPatientEmail: string): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.get<any>(`${this.patientUrl}/email/${selectedPatientEmail}`, { headers });
}

adminUpdatePatient(selectedPatientEmail: string, updatedData: any): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.patch(
    `${this.patientUrl}/adjust/update/${selectedPatientEmail}`,
    updatedData,
    { headers, responseType: 'text' }
  );
}

adminDeletePatient(selectedPatientEmail: string): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.delete(
    `${this.patientUrl}/${selectedPatientEmail}`,
    { headers, responseType: 'text' }
  );
}






}
