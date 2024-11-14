import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalService } from './modal.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

// or via CommonJS
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

  private staffUrl = "https://localhost:5001/api/Staff";

  constructor(private fb: FormBuilder, private modalService: ModalService,
    private http: HttpClient, private authService: AuthService, private router: Router) {
    // Define os controles do formulário com validações
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      userEmail: ['', [Validators.required, Validators.email] ],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      gender: ['', Validators.required],
      inputTag: [''], // Controlador para o campo de "Allergies"
      emergencyContactName: ['', Validators.required],
      emergencyContactEmail: ['', [Validators.required, Validators.email]],
      emergencyContactPhone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      agree: [false, Validators.requiredTrue]
    });
    
    this.staffForm = this.fb.group({});
    this.patientForm = this.fb.group({});
  }

  selectedStaffId: number | null = null;
  selectedPatientEmail: string | null = null;

  selectStaff(id: number) {
    this.selectedStaffId = this.selectedStaffId === id ? null : id;
  }


  selectPatient(email: string) {
    this.selectedPatientEmail = this.selectedPatientEmail === email ? null : email;
  }



  myForm: FormGroup;
  staffForm: FormGroup;
  patientForm: FormGroup;
  tags: string[] = [];  // Array para armazenar as tags
  successMessage: string | null = null;
  errorMessage: string | null = null;
  patientsProfiles: any[] = [];
  staffsProfiles: any[] = [];
  searchTerm: string = '';
  filterField: string = '';

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



  // Método para submeter o formulário
  onSubmit() {


    const token = this.authService.getToken();


    if (!token) {
      alert('You are not logged in!');
      return;
    }

    if (this.myForm.valid) {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

      this.myForm.patchValue({ inputTag: this.tags });

      // Obtém os valores do formulário
      const formData = this.myForm.value;
      const apiUrl = 'https://localhost:5001/api/Patients/register'; // URL da sua API

      // Enviar os dados diretamente com HttpClient
      this.http.post(apiUrl, formData,{ headers })
      .subscribe(
        response => {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Formulário submetido com sucesso"
          });
          // Redefinir o formulário após o envio, se desejado
          this.myForm.reset();
        },
        error => {
          console.error("Erro ao submeter o formulário", error);
        }
      );

    } else {
      // Marque todos os campos como tocados para exibir as mensagens de erro
      this.myForm.markAllAsTouched();
      console.log("Formulário inválido");
    }

  }

  /*
  onSubmit() {
    if (this.myForm.valid) {
      // Obtém os valores do formulário
      const formData = this.myForm.value;
      const apiUrl = 'https://sua-api.com/endpoint'; // URL da sua API

      // Enviar os dados diretamente com HttpClient
      this.http.post(apiUrl, formData).subscribe(
        response => {
          console.log("Formulário submetido com sucesso", response);
          // Redefinir o formulário após o envio, se desejado
          this.myForm.reset();
        },
        error => {
          console.error("Erro ao submeter o formulário", error);
        }
      );

    } else {
      // Marque todos os campos como tocados para exibir as mensagens de erro
      this.myForm.markAllAsTouched();
      console.log("Formulário inválido");
    }
  }
  
  */

  onSubmitPatient(){}









  onSubmitStaff(){}
  deactivateStaff(){
    const token = this.authService.getToken();

    if (!token) {
      this.errorMessage = 'You are not logged in!';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    if (this.selectedStaffId === null) {
      window.alert("Please select a staff member to deactivate.");
    } else {
      console.log(`Deactivating staff ID: ${this.selectedStaffId}`);
      this.http.delete<string>(`${this.staffUrl}/${this.selectedStaffId}`, { headers })
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.error('Error deactivating staff:', error);
          this.errorMessage = 'Failed to deactivate staff profiles!';
        }
      });
      this.getAllstaffsProfiles();
    }
  }

  viewStaff(){
    const token = this.authService.getToken();

    if (!token) {
      this.errorMessage = 'You are not logged in!';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    if (this.selectedStaffId === null) {
      window.alert("Please select a staff member to view.");
    } else {
      console.log(`Viewing staff ID: ${this.selectedStaffId}`);
      this.http.get<string>(`${this.staffUrl}/${this.selectedStaffId}`, { headers })
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.error('Error viewing staff:', error);
          this.errorMessage = 'Failed to view staff profiles!';
        }
      });
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



  ngOnInit() {
    const token = this.authService.getToken();

    if (!token) {
      console.log("abc");
      this.errorMessage = 'You are not logged in!';
      this.router.navigate(['/']);
    }
    this.getAllpatientsProfiles(); // Fetch all profiles on component initialization
    this.getAllstaffsProfiles(); // Fetch all profiles on component initialization
  }

  // Novo método para atualizar a lista ao mudar o filtro
  onFilterChange() {
    this.getAllpatientsProfiles();
  }
  onFilter2Change() {
    this.getAllstaffsProfiles();
  }
  // Method to fetch all patients profiles
  getAllpatientsProfiles() {
    const token = this.authService.getToken();

    if (!token) {
      this.errorMessage = 'You are not logged in!';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const params = new HttpParams()
  .set(this.filterField.toLowerCase().replace(/\s+/g, '')  // Converte para minúsculas e remove os espaços
, this.searchTerm || '');



    this.http.get<any[]>('https://localhost:5001/api/Patients/search', { headers, params })
      .subscribe({
        next: (response) => {
          this.patientsProfiles = response;
          console.log(response);
          console.log(params);
        },
        error: (error) => {
          console.error('Error fetching  profiles:', error);
          this.errorMessage = 'Failed to fetch patients profiles!';
        }
      });
  }

  getAllstaffsProfiles() {
    const token = this.authService.getToken();

    if (!token) {
      this.errorMessage = 'You are not logged in!';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const params = new HttpParams()
  .set(this.filterField.toLowerCase().replace(/\s+/g, '')  // Converte para minúsculas e remove os espaços
, this.searchTerm || '');



    this.http.get<any[]>(`${this.staffUrl}`, { headers, params })
      .subscribe({
        next: (response) => {
          this.staffsProfiles = response;
          console.log(response);
          console.log(params);
        },
        error: (error) => {
          console.error('Error fetching  profiles:', error);
          this.errorMessage = 'Failed to fetch staffs profiles!';
        }
      });
  }



}
