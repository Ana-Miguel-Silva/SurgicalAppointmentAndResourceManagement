import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormArray, FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
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
  private patientUrl = "https://localhost:5001/api/Patients";

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
      allergies: [''], // Controlador para o campo de "Allergies"
      emergencyContactName: ['', Validators.required],
      emergencyContactEmail: ['', [Validators.required, Validators.email]],
      emergencyContactPhone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      agree: [false, Validators.requiredTrue]
    });

    this.patientUpdateForm = this.fb.group({
      name: ['', Validators.required],
      userEmail: ['', [Validators.required, Validators.email]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      gender: ['', Validators.required],
      emergencyContactName: ['', Validators.required],
      emergencyContactEmail: ['', [Validators.required, Validators.email]],
      emergencyContactPhone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      agree: [false, Validators.requiredTrue],
      appointmentHistory: this.fb.array([]),
      allergies: this.fb.array([])
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
      license: ['', Validators.required],
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
      license: ['', Validators.required],
      slots: [''],
    });
    this.staffEditionForm = this.fb.group({
      email: ['', Validators.required],
      phone: ['', Validators.required],
      specialization: ['', Validators.required],
      startTime: [''],
      endTime: [''],
    });
    this.staffEditionForm2 = this.fb.group({
      email: ['', Validators.required],
      phone: ['', Validators.required],
      specialization: ['', Validators.required],
    });
    this.slotsForm = this.fb.group({
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
  patientUpdateForm!: FormGroup;
  staffForm: FormGroup;
  patientForm: FormGroup;
  staffCreationForm: FormGroup;
  staffCreationForm2: FormGroup;
  staffEditionForm: FormGroup;
  staffEditionForm2: FormGroup;
  slotsForm: FormGroup;
  tags: string[] = [];  // Array para armazenar as tags
  appointmentHistoryUpdate: string[] = [];
  tagsUpdates: string[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;
  patientsProfiles: any[] = [];
  staffsProfiles: any[] = [];
  staffProfileSingle: any = null;
  patientProfileSingle: any = null;
  patientProfileUpdate: any = null;
  availabilitySlots: any[] = [];
  availabilitySlots2: any[] = [];
  availabilitySlots3: any[] = [];
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


  formatDateToISO(date: string | Date): string {
    if (!date) return ''; // Evita erros caso a data seja nula
    const parsedDate = new Date(date);
    return parsedDate.toISOString().split('T')[0];
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
      const apiUrl = `${this.patientUrl}/register`

      //TODO: Adicionar opção de historico de appointments
      // Enviar os dados diretamente com HttpClient
      this.http.post(apiUrl, formData, { headers })
        .subscribe(
          response => {
            Swal.fire({
              icon: "success",
              title: "Patient adicionado com sucesso!",
              toast: true,
              position: "top-end",
              timer: 3000,
              showConfirmButton: false
            });
            this.myForm.reset(); // Redefinir o formulário após o envio
            this.appointmentHistory = []; // Limpar o array de tags após o envio
          },
          error => {
            console.error("Erro ao submeter o formulário", error);
              console.error('Error editing patient:', error);
              Swal.fire({
                icon: "error",
                title: "Não foi possível adicionar o patient devido a algum atributo",
                toast: true,
                position: "top-end",
                timer: 3000,
                showConfirmButton: false
              });
              this.errorMessage = 'Failed to edit patient!';
              this.successMessage = null;
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

  editPatient(){


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
    if (this.selectedPatientEmail === null) {
      Swal.fire({
        icon: "warning",
        title: "Por favor seleciona um Patient.",
        toast: true,
        position: "bottom-right",
        timer: 3000,
        showConfirmButton: false
      });
    }else {
      console.log(`Viewing Patient Email: ${this.selectedPatientEmail}`);
      this.http.get<string>(`${this.patientUrl}/email/${this.selectedPatientEmail}`, { headers })
      .subscribe({
        next: (response) => {
          console.log(response);
          this.patientProfileUpdate = response;

          this.populateUpdateForm();


          const updatedPatientData = this.patientUpdateForm.value;
          console.log('Updated Patient Data:', updatedPatientData);
          this.openModal('UpdatePatientModal');
        },
        error: (error) => {
          console.error('Error getting patient:', error);
          this.errorMessage = 'Failed to getting patient profile!';
        }
      });
    }

      

  }


  populateUpdateForm(): void {
    this.patientUpdateForm.patchValue({
        name: `${this.patientProfileUpdate.name.firstName} ${this.patientProfileUpdate.name.middleNames} ${this.patientProfileUpdate.name.lastName}`,
        email: this.patientProfileUpdate.email.fullEmail,
        phone: this.patientProfileUpdate.phone.number,
        userEmail: this.patientProfileUpdate.userEmail.fullEmail,
        gender: this.patientProfileUpdate.gender,
        emergencyContactName: this.patientProfileUpdate.nameEmergency,
        emergencyContactEmail: this.patientProfileUpdate.emailEmergency.fullEmail,
        emergencyContactPhone: this.patientProfileUpdate.phoneEmergency.number,


    });

    const appointmentHistoryArray = this.patientUpdateForm.get('appointmentHistory') as FormArray;
    const allergiesArray = this.patientUpdateForm.get('allergies') as FormArray;
    appointmentHistoryArray.clear();
    allergiesArray.clear();
  
    // Popula o FormArray de appointmentHistory
    if (this.patientProfileUpdate.appointmentHistory) {
      this.patientProfileUpdate.appointmentHistory.forEach((appointment: string) => {
        appointmentHistoryArray.push(new FormControl(appointment));
      });
      this.appointmentHistoryUpdate = [...this.patientProfileUpdate.appointmentHistory]; // Sincroniza com o array local
    }
  
    // Popula o FormArray de allergies
    if (this.patientProfileUpdate.allergies) {
      this.patientProfileUpdate.allergies.forEach((allergy: string) => {
        allergiesArray.push(new FormControl(allergy));
      });
      this.tags = [...this.patientProfileUpdate.allergies]; // Sincroniza com o array local
    }
  }

  onUpdatePatient() {

    const token = this.authService.getToken();

    if (!token) {
      this.errorMessage = 'You are not logged in!';
      return;
    }


    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log(this.patientUpdateForm.value);

    this.http.patch(`${this.patientUrl}/adjust/update/${this.selectedPatientEmail}`, this.patientUpdateForm.value , { headers })
      .subscribe({
        next: (response: any) => {
          console.log(response)
          //this.successMessage = 'Time Slots Added!';
          //this.errorMessage = null;
          Swal.fire({
            icon: "success",
            title: "Patient atualizado com sucesso!",
            toast: true,
            position: "top-end",
            timer: 3000,
            showConfirmButton: false
          });
          this.getAllpatientsProfiles(); // Refresh the list after creation
          this.closeModal('UpdatePatientModal');
        },
        error: (error) => {
          console.error('Error editing patient:', error);
          Swal.fire({
            icon: "error",
            title: "Não foi possível atualizar o patient",
            toast: true,
            position: "top-end",
            timer: 3000,
            showConfirmButton: false
          });
          this.errorMessage = 'Failed to edit patient!';
          this.successMessage = null;
        }
      });



  }

  deactivatePatient(){
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
    if (this.selectedPatientEmail === null) {
      Swal.fire({
        icon: "warning",
        title: "Por favor seleciona um Patient.",
        toast: true,
        position: "bottom-right",
        timer: 3000,
        showConfirmButton: false
      });
    } else {
      if (document.getElementById("active_"+this.selectedPatientEmail+"_false")){
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
        icon: "warning",
        iconColor: '#d33',
        title: "Desativar este Perfil?",
        text: "Não é possível reverter esta decisão.",
        showCancelButton: true,
        confirmButtonText: "Desativar",
        confirmButtonColor: "#d33",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          console.log(`Deactivating Patient Email: ${this.selectedPatientEmail}`);
          this.http.delete<string>(`${this.patientUrl}/${this.selectedPatientEmail}`, { headers })
          .subscribe({
            next: (response) => {
              console.log(response);
              this.getAllpatientsProfiles();
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

  


  viewPatient(){
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
    if (this.selectedPatientEmail === null) {
      Swal.fire({
        icon: "warning",
        title: "Por favor seleciona um Patient.",
        toast: true,
        position: "bottom-right",
        timer: 3000,
        showConfirmButton: false
      });

    } else {
      console.log(`Viewing Patient Email: ${this.selectedPatientEmail}`);
      this.http.get<string>(`${this.patientUrl}/email/${this.selectedPatientEmail}`, { headers })
      .subscribe({
        next: (response) => {
          console.log(response);
          this.patientProfileSingle = response;

          this.openModal('viewPatientModal');
        },
        error: (error) => {
          console.error('Error viewing patient:', error);
          this.errorMessage = 'Failed to view patient profile!';
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
          this.availabilitySlots = this.staffProfileSingle.slots.slice();
          this.staffEditionForm.get('email')?.setValue(this.staffProfileSingle.email.fullEmail);
          this.staffEditionForm.get('phone')?.setValue(this.staffProfileSingle.phoneNumber.number);
          this.staffEditionForm.get('specialization')?.setValue(this.staffProfileSingle.specialization);
          this.availabilitySlots3 = this.staffProfileSingle.slots.slice();
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
    const oldSlots = this.staffProfileSingle.slots;
    const newSlots = this.availabilitySlots3;
    console.log("-------------");
    const commonElements = oldSlots.filter((value: any) => newSlots.includes(value));
    const toRemove = oldSlots.filter((value: any) => !commonElements.includes(value));
    const toCreate = newSlots.filter((value: any) => !commonElements.includes(value));
    this.slotsForm.patchValue({slots: toCreate});
    const formDataA = this.slotsForm.value;
    this.http.put(`${this.staffUrl}/${this.selectedStaffId}/SlotsAdd`, JSON.stringify(formDataA).replaceAll("Time",""), { headers })
      .subscribe({
        next: () => {
          this.successMessage = 'Time Slots Added!';
          this.errorMessage = null;
          Swal.fire({
            icon: "success",
            title: "Time Slots adicionadas com sucesso.",
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
            title: "Não foi possível adicionar uma ou mais Time Slots.",
            toast: true,
            position: "top-end",
            timer: 3000,
            showConfirmButton: false
          });
          this.errorMessage = 'Failed to edit staff!';
          this.successMessage = null;
        }
      });
      this.slotsForm.patchValue({slots: toRemove});
      const formDataB = this.slotsForm.value;
      this.http.put(`${this.staffUrl}/${this.selectedStaffId}/SlotsRemove`, JSON.stringify(formDataB).replaceAll("Time",""), { headers })
        .subscribe({
          next: () => {
            this.successMessage = 'Time Slots Removed!';
            this.errorMessage = null;
            Swal.fire({
              icon: "success",
              title: "Time Slots removidas com sucesso.",
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
              title: "Não foi possível remover uma ou mais Time Slots.",
              toast: true,
              position: "top-end",
              timer: 3000,
              showConfirmButton: false
            });
            this.errorMessage = 'Failed to edit staff!';
            this.successMessage = null;
          }
        });
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
  removeDate3(index: number) {
    this.availabilitySlots3.splice(index, 1);  // Remove a data do array pelo índice
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
  addDate3() {
    const formData = this.staffEditionForm.value;
    const start = this.staffEditionForm.get('startTime')?.value;
    const end = this.staffEditionForm.get('endTime')?.value;
    console.log(start);
    console.log(end);
    if (start && end) {
      const json = {startTime: start, endTime: end}
      console.log(json);
      this.availabilitySlots3.push(json);  // Adiciona a data ao array
    }
  }




  
  addDatePUpdate(event: Event) {
    const input = event.target as HTMLInputElement;
    const selectedDate = input.value;
  
    if (selectedDate) {
      // Adiciona ao array local
      this.appointmentHistoryUpdate.push(selectedDate);
  
      // Adiciona ao FormArray
      const appointmentHistoryControl = this.patientUpdateForm.get('appointmentHistory') as FormArray;
      appointmentHistoryControl.push(new FormControl(selectedDate));
  
      // Limpa o campo de entrada
      input.value = '';
    }
  }
  
  removeDatePUpdate(index: number) {
    // Remove do array local
    this.appointmentHistoryUpdate.splice(index, 1);
  
    // Remove do FormArray
    const appointmentHistoryControl = this.patientUpdateForm.get('appointmentHistory') as FormArray;
    appointmentHistoryControl.removeAt(index);
  }
  
  addTag(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
  
    if (event.key === 'Enter' && value) {
      event.preventDefault(); // Impede o envio do formulário
      this.tags.push(value); // Adiciona ao array local
  
      // Adiciona ao FormArray
      const allergiesControl = this.patientUpdateForm.get('allergies') as FormArray;
      allergiesControl.push(new FormControl(value));
  
      // Limpa o campo de entrada
      input.value = '';
    }
  }
  
  removeTag(index: number) {
    // Remove do array local
    this.tags.splice(index, 1);
  
    // Remove do FormArray
    const allergiesControl = this.patientUpdateForm.get('allergies') as FormArray;
    allergiesControl.removeAt(index);
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



    this.http.get<any[]>(`${this.patientUrl}/search`, { headers, params })
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
    this.staffCreationForm2.patchValue({ license: this.staffCreationForm.get('license')?.value });
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
