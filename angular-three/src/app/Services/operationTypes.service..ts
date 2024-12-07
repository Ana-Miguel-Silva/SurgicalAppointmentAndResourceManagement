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
export class OperationTypesService {
  private apiUrl = `${environment.apiBaseUrl}/OperationTypes`;

  constructor(private http: HttpClient, private authService: AuthService) {}

getAllOperationTypes(): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any[]>(`${this.apiUrl}`, { headers });
}

createOperationTypes(operationTupe : any): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.post(`${this.apiUrl}`, operationTupe, { headers })
}

getSearchOperationTypes(params : any): Observable<any[]> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.get<any[]>(`${this.apiUrl}/search`, { headers, params });
}

getOperationTypeById(id: string): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
}

InactivateAsync(id: string): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
}

UpdateOperationType(selectOperationTypeId: string, updatedData: any): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.patch(
    `${this.apiUrl}/${selectOperationTypeId}`,
    updatedData,
    { headers}
  );
}



}
