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
export class RoomTypesService {
  private apiUrl = `${environment.apiBaseUrl}/RoomTypess`;

  constructor(private http: HttpClient, private authService: AuthService) {}

insertRoomTypes(params : any): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  

  return this.http.post(`${this.apiUrl}`, params, { headers })
}


getAllRoomTypes(): Observable<any[]> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.get<any[]>(`${this.apiUrl}`, { headers });
}

getByCode(id : string): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
}

update(updatedData: any): Observable<any> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.patch<any>(`${this.apiUrl}/update`, updatedData, { headers });
}

/*updateAllergie(selectAllergy: string, updatedData: any): Observable<any> {

  const token = this.authService.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  return this.http.patch(
    `${this.apiUrl}/?designacao=${selectAllergy}`,
    updatedData,
    { headers, responseType: 'text' }
  );
}*/


}
