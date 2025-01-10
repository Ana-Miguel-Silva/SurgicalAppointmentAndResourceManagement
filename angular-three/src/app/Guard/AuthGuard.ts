import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {


    const exemptedRoutes = ['user']; 
    const exemptedRoutes2 = ['users']; 
 
    const currentRoute = route.url.map(segment => segment.path).join('/');

    if (exemptedRoutes.includes(route.routeConfig?.path|| '') || exemptedRoutes2.includes(route.routeConfig?.path || '')) {
      return true;
    }

   

    const expectedRole = route.data['role'];
    const token = route.queryParams['token'];
      
    console.log(token);

    if (token) {
      localStorage.setItem('auth_token', token);      
    }



    if (this.authService.isTokenValid()) {
      if ((expectedRole === 'Admin' && this.authService.isAdmin()) ||
          (expectedRole === 'Doctor' && this.authService.isDoctor()) ||
          (expectedRole === 'Patient' && this.authService.isPatient())) {
        return true;
      }
    }

    this.router.navigate([''], { queryParams: { message: 'Access denied' } });
    return false;
  }
}
