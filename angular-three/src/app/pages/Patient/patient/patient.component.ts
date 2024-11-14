import { ChangeDetectorRef,Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { PatientService } from '../../../Services/patient.service';
import { Patient } from '../patient/patient.model';
import { NgModule } from '@angular/core';
import { FormBuilder, FormControl,FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';




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



  constructor(private fb: FormBuilder, private patientService: PatientService, private cdr: ChangeDetectorRef) {}
    // Define os controles do formulário com validações
    ngOnInit(): void {
      this.myForm = this.fb.group({
        id: [''],
        name: [''],
        dateOfBirth: [''],
        medicalRecordNumber: [''],
        email: [''],
        phone: [''],
        gender: [''],
        allergies: [[]],
        inputTag: [''],
        emergencyContact: this.fb.group({
          name: [''],
          email: [''],
          phone: ['']
        })
      });
  
      this.loadPatientData('87557716-193c-4f53-964f-825e27cabe0b'); // Passe o ID do paciente
    }

    loadPatientData(id: string): void {
      this.patientService.getPatientById(id).subscribe(
        (patient: Patient) => {
          console.log('Dados do paciente:', patient);
          this.myForm.patchValue({
            id: patient.id,
            name: patient.name,
            dateOfBirth: patient.dateOfBirth,
            medicalRecordNumber: patient.medicalRecordNumber,
            email: patient.email,
            phone: patient.phone,
            gender: patient.gender,
            allergies: patient.allergies,
            emergencyContact: {
              name: patient.emergencyContactName,
              email: patient.emergencyContactEmail,
              phone: patient.emergencyContactPhone
            }   
          });

          this.openModal();
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Erro ao carregar os dados do paciente', error);
        }
      );
    }

  tags: string[] = [];  // Array para armazenar as tags


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



    if (event.key === 'Enter' && inputTag) {
      event.preventDefault();  // Evita o envio do formulário
      this.tags.push(inputTag);  // Adiciona a tag ao array se o valor não estiver vazio
      inputTagControl?.setValue('');  // Limpa o campo de input usando setValue
    }
  }
  // Método para remover uma tag pelo índice
  removeTag(index: number) {
    this.tags.splice(index, 1);  // Remove a tag do array pelo índice
  }



}




