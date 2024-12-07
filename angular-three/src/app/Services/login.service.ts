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
export class LoginService {  


 private apiUrl = `${environment.apiBaseUrl}/Users/login`;

  constructor(private http: HttpClient, private authService: AuthService) {}

postLogin(loginObj : any): Observable<string> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<string>(`${this.apiUrl}`, loginObj, { responseType: 'text' as 'json', headers });
}

}
