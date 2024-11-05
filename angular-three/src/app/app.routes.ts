import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AdminComponent } from './pages/Admin/admin/admin.component';
import { AuthGuard } from './Guard/AuthGuard';

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
 
  {path: 'login', component: LoginComponent},

  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { role: 'Admin' } },
 

  ];
  
