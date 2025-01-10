import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { PatientService } from '../../Services/patient.service';
import { NgModule } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ModalService } from '../../Services/modal.service';
import Swal from 'sweetalert2';
import { sweetAlertService } from '../../Services/sweetAlert.service';


@Component({
  selector: 'app-user',
  standalone: true,  
  imports: [CommonModule,ReactiveFormsModule,FormsModule ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

  constructor(  private route: ActivatedRoute, private modalService: ModalService, private authService: AuthService,  private router: Router, private fb: FormBuilder, private http: HttpClient, private patientService: PatientService, private sweetService : sweetAlertService) {





      this.myForm = this.fb.group({
        Name: ['', Validators.required],
        DateOfBirth: ['', Validators.required],
        UserEmail: ['', [Validators.required, Validators.email] ],
        Email: ['', [Validators.required, Validators.email]],
        Phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
        gender: ['', Validators.required],
       // agree: [false, Validators.requiredTrue]
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
    errorMessage: string | null = null;

    ngOnInit() {
      this.openModal('registerPatientModalUser');
      
    }


    isPolicyAccepted = false;
    showPolicyModal = false;
  
  
    openPolicyModal() {
      this.showPolicyModal = true;
    }
  
    closePolicyModal() {
      this.showPolicyModal = false;
    }
  
    acceptPolicy() {
      this.isPolicyAccepted = true;
      this.closePolicyModal();
    }
  
    rejectPolicy() {
      this.isPolicyAccepted = false;
      this.closePolicyModal();
    }



    openModal(modalId: string): void {
      console.log("POLICY")
      this.modalService.openModal(modalId);
    }
  
    closeModal(modalId: string): void {
      this.modalService.closeModal(modalId);
      this.rejectPolicy();
    }
  
    isModalOpen(modalId: string): boolean {
      return this.modalService.isModalOpen(modalId);
    }


  onSubmit() { 

      const formData = this.myForm.value;

      console.log(formData);


      if (this.myForm.valid) {

        const patientDto = {
          Name: formData.Name,
          DateOfBirth: formData.DateOfBirth,
          Phone: formData.Phone,
          Email: formData.Email,
          UserEmail: formData.UserEmail,
          Gender: formData.gender
        };
        console.log(patientDto);

      
          this.patientService.registerPatient(patientDto).subscribe(
            response => {
              this.sweetService.sweetSuccess("Paciente submetido com sucesso");
              this.myForm.reset();
            },
            error => {
              console.error("Erro ao submeter o formulário", error);
              this.sweetService.sweetErro("Ocorreu um erro ao submeter o formulário.");
            }
          );
      
    } else {
      this.myForm.markAllAsTouched();
      console.log("Formulário inválido");
    }
  }




}
