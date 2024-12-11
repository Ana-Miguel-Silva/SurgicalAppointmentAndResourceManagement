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
export class AllergiesService {
  private apiUrl = `${environment.apiMongoUrl}/allergie`;

  constructor(private http: HttpClient, private authService: AuthService) {}

/*createOperationRequests(operationRequest : any): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.post(`${this.apiUrl}`, operationRequest, { headers })
}

updateOperationRequests(operationRequest: any): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.patch(`${this.apiUrl}/${operationRequest.id}`, operationRequest, { headers });
}

deleteOperationRequests(id: any): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.delete(`${this.apiUrl}/${id}`, { headers });
}*/


getAllAllergies(): Observable<any[]> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.get<any[]>(`${this.apiUrl}/get`, { headers });
}

}
