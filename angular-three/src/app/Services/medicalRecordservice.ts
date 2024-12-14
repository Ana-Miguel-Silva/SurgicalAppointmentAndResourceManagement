import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})

@Injectable()
export class MedicalRecordService {

  private apiUrl = `${environment.apiMongoUrl}/medicalRecord`;

  private apiBEUrl = `${environment.apiBaseUrl}/Patients`;

  constructor(private http: HttpClient, private authService: AuthService) {}

createMedicalRecord(medicalRecord : any): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.post(`${this.apiUrl}/create`, medicalRecord, { headers })
}


getAllMedicalRecord(): Observable<any[]> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.get<any[]>(`${this.apiUrl}/get`, { headers });
}

getAllMedicalRecordCorrected(medicalRecords : any[]): Observable<any[]> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.put<any[]>(`${this.apiBEUrl}/getMedicalRecords`, { headers, medicalRecords });
}



}
