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
    if (typeof window !== 'undefined') {
    return localStorage.getItem(this.tokenKey);
  }
  return null;
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

  getEmail(): string {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload & { [key: string]: any }>(token || '');
        console.log('Decoded Token:', decodedToken);
        
        const emailClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';
        const email = decodedToken[emailClaim] || decodedToken['email'];
        return email ? email : '';

      } catch (error) {
        console.error("Invalid token", error);
        return '';
      }
    }
    return '';
  }

  getId(): string {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload & { [key: string]: any }>(token || '');
        const idClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
        const id = decodedToken[idClaim];
        return id ? id : '';
      } catch (error) {
        console.error('Invalid token', error);
        return '';
      }
    }
    return '';
  }
  

  

  isAdmin(): boolean {
    return this.getRoles().includes('ADMIN');
  }

  isDoctor(): boolean {
    return this.getRoles().includes('DOCTOR');
  }


  isPatient(): boolean {
    return this.getRoles().includes('PATIENT');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
  
    try {
      const decodedToken:any= jwtDecode<JwtPayload & { [key: string]: any }>(token);
      const currentTime = Math.floor(Date.now() / 1000); // Tempo atual em segundos
      return decodedToken.exp > currentTime; // Verifica se o token não expirou
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
  }
}
