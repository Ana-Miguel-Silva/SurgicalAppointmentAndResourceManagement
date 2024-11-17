import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../Services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MockAuthService {

  constructor() { }

  // Mock implementation of setToken
  setToken(token: string): void {
    // Do nothing in mock service
  }

  // Mock implementation of getToken
  getToken(): string | null {
    return 'mock-token'; // Return a mock token
  }

  // Mock implementation of getRoles
  getRoles(): string {
    return 'ADMIN'; // Return a mock role
  }

  // Mock implementation of isAdmin
  isAdmin(): boolean {
    return true; // Mock user as an admin
  }

  // Mock implementation of isDoctor
  isDoctor(): boolean {
    return false; // Mock user as not a doctor
  }

  // Mock implementation of isPatient
  isPatient(): boolean {
    return false; // Mock user as not a patient
  }

  // Mock implementation of isLoggedIn
  isLoggedIn(): boolean {
    return true; // Mock the user as logged in
  }

  // Mock implementation of logout
  logout(): void {
    // Do nothing in mock service
  }

  // Mock implementation of isTokenValid
  isTokenValid(): boolean {
    return true; // Mock token as valid
  }

  // Mock implementation of getEmail
  getEmail(): string {
    return 'mock@example.com'; // Return a mock email
  }
}
