import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import e from 'express';





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

  onLogin(){

    this.http.post<string>("https://localhost:5001/api/Users/login", this.loginObj, { responseType: 'text' as 'json' }).subscribe({
      next: token => {
        console.log(token);
        alert('Login Success!');
        this.authService.setToken(token);

        if (this.authService.isAdmin()) this.router.navigate(['/admin']);
        else if (this.authService.isPatient()) this.router.navigate(['/patient']);
        else if (this.authService.isDoctor()) this.router.navigate(['/doctor']);

      },
      error: error => {
        console.error(error);
        alert("Login Fail!");
      },
      complete: () => {
        console.log('Request completed');
      }
    });
  }
}
