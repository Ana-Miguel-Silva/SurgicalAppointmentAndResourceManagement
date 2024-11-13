import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
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

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }



  constructor(private fb: FormBuilder) {
    // Define os controles do formulário com validações
    this.myForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      agree: [false, Validators.requiredTrue],
      inputTag: new FormControl('')
    });
  }

  myForm: FormGroup;
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




