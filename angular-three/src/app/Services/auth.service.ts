import { Injectable } from '@angular/core'; 
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  
  private tokenKey = 'auth_token';

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRoles(): string[] {
    const token = this.getToken();
    if (token) {
     /// const decodedToken = jwt_decode<{ roles: string[] }>(token);
      //return decodedToken.roles;
      return [];
    }
    return [];
  }

  isAdmin(): boolean {
    return this.getRoles().includes('Admin');
  }

  isDoctor(): boolean {
    return this.getRoles().includes('Doctor');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
