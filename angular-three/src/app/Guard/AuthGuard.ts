import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role'];

    if ((expectedRole === 'Admin' && this.authService.isAdmin()) ||
        (expectedRole === 'Doctor' && this.authService.isDoctor()) ||
        (expectedRole === 'Patient' && this.authService.isDoctor())) {
      return true;
    }

    // Redireciona para uma página de acesso negado ou login se o papel não corresponder
    this.router.navigate(['/login']);
    return false;
  }
}
