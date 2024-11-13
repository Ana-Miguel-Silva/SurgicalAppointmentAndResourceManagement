import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl,FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

  constructor(private fb: FormBuilder, private modalService: ModalService) {
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

    
 
  /*onBackdropClick(event: MouseEvent) {
    this.closeModal(); // Fecha o modal ao clicar fora do conteúdo
  }*/

  openModal(modalId: string): void {
    this.modalService.openModal(modalId);
  }

  closeModal(modalId: string): void {
    this.modalService.closeModal(modalId);
  }

  isModalOpen(modalId: string): boolean {
    return this.modalService.isModalOpen(modalId);
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
