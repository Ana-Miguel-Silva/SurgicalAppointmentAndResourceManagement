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
export class AppointmentService {
  private apiUrl = `${environment.apiBaseUrl}/Appointments`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  scheduleAppointments(): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.post<any>(`${this.apiUrl}/pmodule`, {headers});
}

}
