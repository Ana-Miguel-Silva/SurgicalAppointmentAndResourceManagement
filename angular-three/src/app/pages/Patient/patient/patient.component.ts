import { ChangeDetectorRef,Component, inject } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { PatientService } from '../../../Services/patient.service';
import { Patient } from '../patient/patient.model';
import { NgModule } from '@angular/core';
import { FormBuilder, FormControl,FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss'],
  imports: [CommonModule,ReactiveFormsModule],
  standalone: true,
})


export class PatientComponent {
  isModalOpen: boolean = false;
  modalId: string = 'modalId';
  myForm!: FormGroup;


  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }



  constructor(  private route: ActivatedRoute,  private authService: AuthService,  private router: Router, private fb: FormBuilder, private patientService: PatientService, private cdr: ChangeDetectorRef) {}
    // Define os controles do formulário com validações
    ngOnInit(): void {
     
    
    }


  // Método para submeter o formulário
  onSubmit() {
    if (this.myForm.valid) {
      console.log('Form Submitted!', this.myForm.value);
    } else {
      this.myForm.markAllAsTouched();  // Marca todos os campos para mostrar feedback de validação
    }
  }

  // Método para adicionar uma tag ao array
  addTag(event: KeyboardEvent) {
    const inputTagControl = this.myForm.get('inputTag');
    const inputTag = inputTagControl?.value.trim(); // Obtém o valor atual do input
    console.log(inputTagControl);
    console.log(inputTag);

  }




}




