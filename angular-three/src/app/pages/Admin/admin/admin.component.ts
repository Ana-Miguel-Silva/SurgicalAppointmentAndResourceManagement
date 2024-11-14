import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalService } from './modal.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';

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
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      agree: [false, Validators.requiredTrue],
      inputTag: new FormControl('')  
    });
    this.staffForm = this.fb.group({});
    this.staffCreationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      role: ['', Validators.required],
      specialization: ['', Validators.required],
      inputTag: new FormControl('')  
    });
  }

  selectedStaffId: number | null = null;

  selectStaff(id: number) {
    this.selectedStaffId = this.selectedStaffId === id ? null : id;
  }


  myForm: FormGroup;
  staffForm: FormGroup;
  staffCreationForm: FormGroup;
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
    if (this.myForm.valid) {
      console.log('Form Submitted!', this.myForm.value);
    } else {
      this.myForm.markAllAsTouched();  // Marca todos os campos para mostrar feedback de validação
    }
  }
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
          this.getAllstaffsProfiles();
        },
        error: (error) => {
          console.error('Error deactivating staff:', error);
          this.errorMessage = 'Failed to deactivate staff profiles!';
        }
      });
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
