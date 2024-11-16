import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalService } from '../../../Services/modal.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


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
      appointmentHistory: [''],
      //allergies: [''], // Controlador para o campo de "Allergies"
      emergencyContactName: ['', Validators.required],
      emergencyContactEmail: ['', [Validators.required, Validators.email]],
      emergencyContactPhone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      agree: [false, Validators.requiredTrue]
    });

    this.staffForm = this.fb.group({});
    this.staffCreationForm = this.fb.group({
      //firstName: ['', Validators.required],
      //lastName: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      role: ['', Validators.required],
      specialization: ['', Validators.required],
      startTime: [''],
      endTime: [''],
    });
    this.staffCreationForm2 = this.fb.group({
      //firstName: ['', Validators.required],
      //lastName: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      role: ['', Validators.required],
      specialization: ['', Validators.required],
      slots: [''],
    });
    this.staffEditionForm = this.fb.group({
      email: ['', Validators.required],
      phone: ['', Validators.required],
      specialization: ['', Validators.required],
      slots: [''],
    });
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
  staffCreationForm: FormGroup;
  staffCreationForm2: FormGroup;
  staffEditionForm: FormGroup;
  tags: string[] = [];  // Array para armazenar as tags
  successMessage: string | null = null;
  errorMessage: string | null = null;
  patientsProfiles: any[] = [];
  staffsProfiles: any[] = [];
  staffProfileSingle: any = null;
  availabilitySlots: any[] = [];
  availabilitySlots2: any[] = [];
  searchTerm: string = '';
  filterField: string = '';
  appointmentHistory: string[] = [];
  slots: string[] = [];

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

      // Define o campo allergies como um array com as tags
      //this.myForm.patchValue({ allergies: this.tags });

      //const formattedAllergies = JSON.stringify(this.tags);
      //this.myForm.patchValue({ allergies: this.tags });
      this.myForm.patchValue({ appointmentHistory: this.appointmentHistory });

      // Obtém os valores do formulário
      const formData = this.myForm.value;
      const apiUrl = 'https://localhost:5001/api/Patients/register';

      //TODO: Adicionar opção de historico de appointments
      // Enviar os dados diretamente com HttpClient
      this.http.post(apiUrl, formData, { headers })
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
            this.tags = []; // Limpar o array de tags após o envio
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

  onSubmitPatient(){}

  onSubmitStaff(){}
  deactivateStaff(){
    const token = this.authService.getToken();

    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Nenhuma conta com sessão ativa.",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false
      });
      this.errorMessage = 'You are not logged in!';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    if (this.selectedStaffId === null) {
      Swal.fire({
        icon: "warning",
        title: "Por favor seleciona um membro de Staff.",
        toast: true,
        position: "bottom-right",
        timer: 3000,
        showConfirmButton: false
      });
    } else {
      if (document.getElementById("active_"+this.selectedStaffId)?.innerText == "false"){
        Swal.fire({
          icon: "error",
          title: "Perfil já está desativado.",
          toast: true,
          position: "bottom-right",
          timer: 3000,
          showConfirmButton: false
        });
        return
      }
      Swal.fire({
        title: "Desativar este Perfil?",
        text: "Não é possível reverter esta decisão.",
        showCancelButton: true,
        confirmButtonText: "Desativar",
        confirmButtonColor: "#d33",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          console.log(`Deactivating staff ID: ${this.selectedStaffId}`);
          this.http.delete<string>(`${this.staffUrl}/${this.selectedStaffId}`, { headers })
          .subscribe({
            next: (response) => {
              console.log(response);
              this.getAllstaffsProfiles();
              Swal.fire({
                icon: "success",
                title: "Perfil desativado com sucesso",
                toast: true,
                position: "top-end",
                timer: 3000,
                showConfirmButton: false
              });
            },
            error: (error) => {
              console.error('Error deactivating staff:', error);
              this.errorMessage = 'Failed to deactivate staff profiles!';
              Swal.fire({
                icon: "error",
                title: "Não foi possível desativar o perfil",
                toast: true,
                position: "top-end",
                timer: 3000,
                showConfirmButton: false
              });
            }
          });
        } else if (result.isDenied) {
        }
      });
      
    }
  }

  viewStaff(){
    const token = this.authService.getToken();

    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Nenhuma conta com sessão ativa.",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false
      });
      this.errorMessage = 'You are not logged in!';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    if (this.selectedStaffId === null) {
      Swal.fire({
        icon: "warning",
        title: "Por favor seleciona um membro de Staff.",
        toast: true,
        position: "bottom-right",
        timer: 3000,
        showConfirmButton: false
      });
    } else {
      console.log(`Viewing staff ID: ${this.selectedStaffId}`);
      this.http.get<string>(`${this.staffUrl}/${this.selectedStaffId}`, { headers })
      .subscribe({
        next: (response) => {
          console.log(response);
          this.staffProfileSingle = response;
          this.availabilitySlots = this.staffProfileSingle.slots;
          this.openModal('viewStaffModal');
        },
        error: (error) => {
          console.error('Error viewing staff:', error);
          this.errorMessage = 'Failed to view staff profiles!';
        }
      });
    }
  }

  editStaff(){
    const token = this.authService.getToken();

    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Nenhuma conta com sessão ativa.",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false
      });
      this.errorMessage = 'You are not logged in!';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    if (this.selectedStaffId === null) {
      Swal.fire({
        icon: "warning",
        title: "Por favor seleciona um membro de Staff.",
        toast: true,
        position: "bottom-right",
        timer: 3000,
        showConfirmButton: false
      });
    } else {
      console.log(`Viewing staff ID: ${this.selectedStaffId}`);
      this.http.get<string>(`${this.staffUrl}/${this.selectedStaffId}`, { headers })
      .subscribe({
        next: (response) => {
          console.log(response);
          this.staffProfileSingle = response;
          this.availabilitySlots = this.staffProfileSingle.slots;
          this.staffEditionForm.get('email')?.setValue(this.staffProfileSingle.email.fullEmail);
          this.staffEditionForm.get('phone')?.setValue(this.staffProfileSingle.phoneNumber.number);
          this.staffEditionForm.get('specialization')?.setValue(this.staffProfileSingle.specialization);
          this.openModal('editStaffModal');
        },
        error: (error) => {
          console.error('Error viewing staff:', error);
          this.errorMessage = 'Failed to view staff profiles!';
        }
      });
    }
  }

  editStaffPost(){
    const token = this.authService.getToken();

    if (!token) {
      this.errorMessage = 'You are not logged in!';
      return;
    }


    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log(`Editing Staff`);
    const formData = this.staffEditionForm.value;
    console.log(formData);
    console.log(JSON.stringify(formData));
    this.http.put(`${this.staffUrl}/${this.selectedStaffId}`, JSON.stringify(formData), { headers })
      .subscribe({
        next: () => {
          this.successMessage = 'Staff Profile Edited!';
          this.errorMessage = null;
          Swal.fire({
            icon: "success",
            title: "Perfil Editado com sucesso",
            toast: true,
            position: "top-end",
            timer: 3000,
            showConfirmButton: false
          });
          this.getAllstaffsProfiles(); // Refresh the list after creation
        },
        error: (error) => {
          console.error('Error editing staff:', error);
          Swal.fire({
            icon: "error",
            title: "Não foi possível editar o Perfil",
            toast: true,
            position: "top-end",
            timer: 3000,
            showConfirmButton: false
          });
          this.errorMessage = 'Failed to edit staff!';
          this.successMessage = null;
        }
      });

  }


  // Método para adicionar uma data ao array
  addDate(event: Event) {
    const formData = this.myForm.value;
    console.log(formData);
    const input = event.target as HTMLInputElement;
    const selectedDate = input.value;
    if (selectedDate) {
      this.appointmentHistory.push(selectedDate);  // Adiciona a data ao array
      input.value = '';  // Limpa o campo de input
    }
  }

  // Método para remover uma data pelo índice
  removeDate(index: number) {
    this.appointmentHistory.splice(index, 1);  // Remove a data do array pelo índice
  }
  removeDate2(index: number) {
    this.availabilitySlots2.splice(index, 1);  // Remove a data do array pelo índice
  }
  addDate2() {
    const formData = this.staffCreationForm.value;
    const start = this.staffCreationForm.get('startTime')?.value;
    const end = this.staffCreationForm.get('endTime')?.value;
    console.log(start);
    console.log(end);
    if (start && end) {
      const json = {start: start, end: end}
      console.log(json);
      this.availabilitySlots2.push(json);  // Adiciona a data ao array
    }
  }



  // Método para adicionar uma tag ao array
  addTag(event: KeyboardEvent) {
    const allergiesControl = this.myForm.get('allergies');
    const allergies = allergiesControl?.value.trim(); // Obtém o valor atual do input
    console.log(allergiesControl);
    console.log(allergies);



    if (event.key === 'Enter' && allergies) {
      event.preventDefault();  // Evita o envio do formulário
      this.tags.push(allergies);  // Adiciona a tag ao array se o valor não estiver vazio
      allergiesControl?.setValue('');  // Limpa o campo de input usando setValue
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


  createStaff(){
    const token = this.authService.getToken();

    if (!token) {
      this.errorMessage = 'You are not logged in!';
      return;
    }


    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log(`Creating new staff ID`);

    /*this.http.delete<string>(`${this.staffUrl}/${this.selectedStaffId}`, { headers })
    .subscribe({
      next: (response) => {
        console.log(response);
        this.getAllstaffsProfiles();
      },
      error: (error) => {
        console.error('Error deactivating staff:', error);
        this.errorMessage = 'Failed to deactivate staff profiles!';
      }
    });*/
    this.staffCreationForm2.patchValue({ name: this.staffCreationForm.get('name')?.value });
    this.staffCreationForm2.patchValue({ email: this.staffCreationForm.get('email')?.value });
    this.staffCreationForm2.patchValue({ phoneNumber: this.staffCreationForm.get('phoneNumber')?.value });
    this.staffCreationForm2.patchValue({ role: this.staffCreationForm.get('role')?.value });
    this.staffCreationForm2.patchValue({ specialization: this.staffCreationForm.get('specialization')?.value });
    this.staffCreationForm2.patchValue({ slots: this.availabilitySlots2 });
    const formData = this.staffCreationForm2.value;
    console.log(formData);
    this.http.post(`${this.staffUrl}`, JSON.stringify(formData), { headers })
      .subscribe({
        next: () => {
          this.successMessage = 'Staff Profile Created!';
          this.errorMessage = null;
          Swal.fire({
            icon: "success",
            title: "Formulário submetido com sucesso",
            toast: true,
            position: "top-end",
            timer: 3000,
            showConfirmButton: false
          });
          this.staffCreationForm.reset();
          this.getAllstaffsProfiles(); // Refresh the list after creation
        },
        error: (error) => {
          console.error('Error creating staff:', error);
          Swal.fire({
            icon: "error",
            title: "Não foi possível criar o Perfil",
            toast: true,
            position: "top-end",
            timer: 3000,
            showConfirmButton: false
          });
          this.errorMessage = 'Failed to create staff!';
          this.successMessage = null;
        }
      });
  }

}
