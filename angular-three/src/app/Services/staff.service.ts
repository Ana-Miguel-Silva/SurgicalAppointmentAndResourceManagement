import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Importa o environment correto
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})

@Injectable()
export class StaffService {

  private staffUrl = `${environment.apiBaseUrl}/Staff`;
  private patientUrl = `${environment.apiBaseUrl}/Patients`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  deactivateStaff(id: string): Observable<any>{
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
          return this.http.delete<any>(`${this.staffUrl}/${id}`, { headers });
  }

  viewStaff(id: string): Observable<any>{
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.staffUrl}/${id}`, { headers });
    }

    getStaff(params: any): Observable<any>{
      const token = this.authService.getToken();
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get<any[]>(`${this.staffUrl}`, { headers, params });
    }

    getStaffByEmail(params: any): Observable<any>{
      const token = this.authService.getToken();
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get<any>(`${this.staffUrl}/email/${params}`, { headers });
    }

  createStaff(formData: any): Observable<any>{
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    console.log(JSON.stringify(formData));
    console.log(headers);
    console.log(`${this.staffUrl}`);
    return this.http.post<any>(`${this.staffUrl}`, JSON.stringify(formData), { headers });
  }

  editStaffPostA(id:string, formData: any): Observable<any>{
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(`${this.staffUrl}/${id}`, JSON.stringify(formData), { headers });
  }


  editStaffPostB(id:string, formData:any): Observable<any>{
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(`${this.staffUrl}/${id}/SlotsAdd`, JSON.stringify(formData).replaceAll("Time",""), { headers });

  }

  removeStaffPostB(id:string, formData:any): Observable<any>{
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(`${this.staffUrl}/${id}/SlotsRemove`, JSON.stringify(formData).replaceAll("Time",""), { headers });

  }

  getAllUIStaffs(): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.get<any[]>(`${this.staffUrl}/UI`, { headers });
  }

}


