import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AdminComponent } from './pages/Admin/admin/admin.component';
import { PatientComponent } from './pages/Patient/patient/patient.component';
import { AuthGuard } from './Guard/AuthGuard';
import { DoctorComponent } from './pages/Doctor/doctor/doctor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserComponent } from './pages/Utilizador/user.component';
import { StatsComponent } from './pages/Stats/stats.component';

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},

  {path: 'login', component: LoginComponent},

  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { role: 'Admin' } },

  { path: 'patient', component: PatientComponent, canActivate: [AuthGuard], data: { role: 'Patient' } },

  { path: 'doctor', component: DoctorComponent, canActivate: [AuthGuard], data: { role: 'Doctor' } },

  { path: 'user', component: UserComponent, canActivate: [AuthGuard]},

  //{ path: 'haproxy', component: StatsComponent},

  ];

