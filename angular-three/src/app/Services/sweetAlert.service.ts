import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // Importa o environment correto
import { AuthService } from './auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})


export class sweetAlertService {

   sweetSuccess(text: string){
  
    Swal.fire({
      icon: "success",
      title: text,
      toast: true,
      position: "top-end",
      timer: 3000,
      showConfirmButton: false
    });
  
  }
  
  sweetWarning(text: string){
  
    Swal.fire({
      icon: "warning",
      title: text,
      toast: true,
      position: "top-end",
      timer: 3000,
      showConfirmButton: false
    });
  
  }
  
  
  sweetErro(text: string){
  
    Swal.fire({
      icon: "error",
      title: text,
      //It was not possible create the allergie
      toast: true,
      position: "top-end",
      timer: 3000,
      showConfirmButton: false
    });
  
  }
  
}