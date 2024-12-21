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
export class MedicalConditionService {
  private apiUrl = `${environment.apiMongoUrl}/medicalCondition`;

  constructor(private http: HttpClient, private authService: AuthService) {}

createMedicalCondition(medicalCondition : any): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.post(`${this.apiUrl}/create`, medicalCondition, { headers })
}

updateMedicalCondition(id: any, operationRequest: any): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.patch(`${this.apiUrl}/update/${id}`, operationRequest, { headers });
}
/*

deleteOperationRequests(id: any): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.delete(`${this.apiUrl}/${id}`, { headers });
}*/


getAllMedicalConditions(): Observable<any[]> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.get<any[]>(`${this.apiUrl}/get`, { headers });
}
viewMedicalCondition(id: any): Observable<any[]> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.get<any[]>(`${this.apiUrl}/get/${id}`, { headers });
}

}
