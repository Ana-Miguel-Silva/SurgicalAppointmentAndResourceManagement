import { Injectable } from '@angular/core'; 
import {jwtDecode, JwtPayload } from 'jwt-decode'

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

  getRoles(): string {
    const token = this.getToken();
    if (token) {
      try {
      
        const decodedToken = jwtDecode<JwtPayload & { [key: string]: any }>(token || '');
        const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        return role ? role : '';  

      } catch (error) {
        console.error("Invalid token", error);
        return '';
      }
    }
    return '';
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
