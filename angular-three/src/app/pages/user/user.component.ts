import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../../Services/auth.service';
import { PatientService } from '../../Services/patient.service';
import { NgModule } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalService } from '../../Services/modal.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

  constructor(  private route: ActivatedRoute, private modalService: ModalService, private authService: AuthService,  private router: Router, private fb: FormBuilder, private http: HttpClient, private patientService: PatientService) {
    
     
      this.myForm = this.fb.group({
        name: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        userEmail: ['', [Validators.required, Validators.email] ],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
        gender: ['', Validators.required],
        agree: [false, Validators.requiredTrue]
      });

      
    
      // Obtém o e-mail do Google passado pela URL
      this.route.queryParams.subscribe(params => {
        const emailFromGoogle = params['email'];
        if (emailFromGoogle) {
          this.myForm.patchValue({ email: emailFromGoogle }); 
        }
      });

      

    
    }
    myForm: FormGroup;

    openModal(modalId: string): void {
      this.modalService.openModal(modalId);
    }
  
    closeModal(modalId: string): void {
      this.modalService.closeModal(modalId);
    }
  
    isModalOpen(modalId: string): boolean {
      return this.modalService.isModalOpen(modalId);
    }

      
  onSubmit() {   

      const formData = this.myForm.value;
      const apiUrl = 'https://localhost:5001/api/users/registerPatient';

      if (this.myForm.valid) {
      this.http.post(apiUrl, formData, formData.userEmail)
        .subscribe(
          response => {
            Swal.fire({
              icon: "success",
              title: "Formulário submetido com sucesso",
              toast: true,
              position: "top-end",
              timer: 3000,
              showConfirmButton: false
            });
            this.myForm.reset(); // Redefinir o formulário após o envio
           
          },
          error => {
            console.error("Erro ao submeter o formulário", error);
          }
        );
    } else {
      this.myForm.markAllAsTouched();
      console.log("Formulário inválido");
    }
  }
  

  onSubmitPatient(){};


}
