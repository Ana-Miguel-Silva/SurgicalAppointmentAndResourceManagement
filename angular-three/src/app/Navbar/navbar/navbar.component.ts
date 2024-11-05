import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  isAdmin: boolean = false;
  isDoctor: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.isDoctor = this.authService.isDoctor();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);  
  }


}
