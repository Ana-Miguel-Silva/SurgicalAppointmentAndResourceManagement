import { Routes } from '@angular/router';
import { CubeComponent } from './cube/cube.component';
export const routes: Routes = [
  // Redirect to the cube component on app load
  { path: '', redirectTo: '/cube', pathMatch: 'full' },
  // Route for the cube component
  { path: 'cube', component: CubeComponent },
  ];
  
