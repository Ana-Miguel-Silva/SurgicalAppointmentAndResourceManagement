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
export class SpecializationService {
  private apiUrl = `${environment.apiBaseUrl}/Specializations`;

  constructor(private http: HttpClient, private authService: AuthService) {}

createSpecialization(specialization : any): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Content-Type', 'application/json');

  return this.http.post(`${this.apiUrl}`, specialization, { headers })
  }

  getAllSpecializations(): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any[]>(`${this.apiUrl}`, { headers });
  }

  viewSpecialization(specialization : any): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any[]>(`${this.apiUrl}/${specialization}`, { headers });
  }
  updateSpecialization(specialization : any, updatedData: any): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`).set('Content-Type', 'application/json');
    console.log(headers);
    console.log(specialization);
    console.log(updatedData);
    return this.http.patch<any[]>(`${this.apiUrl}/${specialization}`, updatedData ,{ headers });
  }
}
