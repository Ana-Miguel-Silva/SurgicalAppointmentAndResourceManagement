import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { LoginService } from '../../Services/login.service';
import e from 'express';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';





@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  
  loginObj : any = {
    "username" : "",
    "password" : ""
  }

  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);
  loginService = inject(LoginService);

  onLogin(){

      this.loginService.postLogin(this.loginObj).subscribe({
      next: token => {
        console.log(token);
        //alert('Login Success!');
        Swal.fire({
          icon: "success",
          title: "Login efetuado com sucesso!",
          toast: true,
          position: "top-end",
          timer: 3000,
          showConfirmButton: false
        });
        this.authService.setToken(token);
        this.navigateToRoleBasedPage();


      },
      error: error => {
        console.error(error);
        //alert("Login Fail!");
        Swal.fire({
          icon: "error",
          title: "Não foi possível efetuar Login...",
          toast: true,
          position: "top-end",
          timer: 3000,
          showConfirmButton: false
        });
      },
      complete: () => {
        console.log('Request completed');
      }
    });

  }

  private navigateToRoleBasedPage() {
    if (this.authService.isAdmin()) this.router.navigate(['/admin']);
    else if (this.authService.isPatient()) this.router.navigate(['/patient']);
    else if (this.authService.isDoctor()) this.router.navigate(['/doctor']);
  }

  // Login pelo Google
  onGoogleLogin() {
    // Redireciona para o backend Google OAuth endpoint
    window.location.href = `${environment.apiMongoUrl}/Patients/ExternalIAM`;
    
    
  }
}
