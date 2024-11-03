import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface LoginResponse {
  token: string;
}



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

  onLogin(){
    debugger;
    this.http.post<LoginResponse>("https://localhost:5001/api/Users/login", this.loginObj).subscribe({
      next: response => {
        console.log(response);
        alert("Login Success!");
        localStorage.setItem('token', response.token)
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