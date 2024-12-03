import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})

@Injectable()
export class LoginService {
  private apiUrl = 'https://'+ '10.9.22.219' +':5001/api/Users/login';

  constructor(private http: HttpClient, private authService: AuthService) {}

postLogin(loginObj : any): Observable<string> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<string>(`${this.apiUrl}`, loginObj, { responseType: 'text' as 'json', headers });
}






}
