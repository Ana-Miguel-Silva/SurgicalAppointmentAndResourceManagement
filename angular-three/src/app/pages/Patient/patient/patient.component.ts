import { ChangeDetectorRef,Component, inject } from '@angular/core';
import { AuthService } from '../../../Services/auth.service';
import { PatientService } from '../../../Services/patient.service';
import { ModalService } from '../../../Services/modal.service';
import { NgModule } from '@angular/core';
import { FormBuilder, FormControl,FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';



@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss'],
  imports: [CommonModule,ReactiveFormsModule],
  standalone: true,
})


export class PatientComponent {

  modalId: string = 'modalId';
  myForm!: FormGroup;
  patientUpdateForm!: FormGroup;

  selectedPatientEmail: string | undefined;
  private patientUrl = `${environment.apiMongoUrl}/Patients`;
  actionId: any;
  allergies: string[] = [];



  constructor(  private route: ActivatedRoute,   private http: HttpClient, private modalService: ModalService,private authService: AuthService,  private router: Router, private fb: FormBuilder, private patientService: PatientService, private cdr: ChangeDetectorRef) {

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
      //agree: [false, Validators.requiredTrue]
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
      //agree: [false, Validators.requiredTrue],
      appointmentHistory: this.fb.array([]),
      allergies: this.fb.array([])
    });
    this.patientForm = this.fb.group({});
  }


  patientForm: FormGroup;
  appointmentHistory: string[] = [];
  tags: string[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;

  patientProfileSingle : any = {
    id: "",
    name: {
      firstName: "",
      middleNames: "",
      lastName: ""
    },
    email: { fullEmail: "" },
    userEmail: { fullEmail: "" },
    phone: { number: "" },
    gender: "",
    nameEmergency: "",
    emailEmergency: { fullEmail: "" },
    phoneEmergency: { number: "" },
    allergies: [],
    appointmentHistory: [],
    medicalRecordNumber: { number: "" },
    dateOfBirth: "",
  };



  openModal(modalId: string): void {
    if (modalId === 'UpdatePatientModal' && this.patientProfileSingle) {
      this.populateUpdateForm();
    }
    this.modalService.openModal(modalId);
  }

  closeModal(modalId: string): void {
    this.modalService.closeModal(modalId);
    this.viewPatient();
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

  formatDateToISO(date: string | Date): string {
    if (!date) return ''; // Evita erros caso a data seja nula
    const parsedDate = new Date(date);
    return parsedDate.toISOString().split('T')[0];
  }


  addDate(event: Event) {
    const input = event.target as HTMLInputElement;
    const selectedDate = input.value;
  
    if (selectedDate) {
      // Adiciona ao array local
      event.preventDefault(); // Impede o envio do formulário
      this.appointmentHistory.push(selectedDate);
  
      // Adiciona ao FormArray
      const appointmentHistoryControl = this.patientUpdateForm.get('appointmentHistory') as FormArray;
      appointmentHistoryControl.push(new FormControl(selectedDate));
  
      // Limpa o campo de entrada
      input.value = '';
    }
  }
  
  removeDate(index: number) {
    // Remove do array local
    this.appointmentHistory.splice(index, 1);
  
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
  




  onUpdatePatient() {
    const token = this.authService.getToken();
  
    if (!token) {
      alert('You are not logged in!');
      return;
    }

    if (!this.selectedPatientEmail) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Nenhum paciente selecionado.',
      });
      return;
    }

  
    const updatedPatientData = this.patientUpdateForm.value;
    console.log('Updated Patient Data:', updatedPatientData);
  
    this.patientService.updatePatient(this.selectedPatientEmail, updatedPatientData).subscribe({
      next: (response: any) => {
        console.log(response);
  
        if (typeof response === 'string' && response.includes('Please check your email to confirm this action')) {
          Swal.fire({
            title: "Submit your code",
            input: "text",
            inputAttributes: {
              autocapitalize: "off"
            },
            showCancelButton: true,
            confirmButtonText: "Submit",
            showLoaderOnConfirm: true,
            preConfirm: (code) => {
              if (!code) {
                Swal.showValidationMessage('Please enter your code');
              }
              return code;
            },
            allowOutsideClick: () => !Swal.isLoading(),
          }).then((result) => {
            if (result.isConfirmed) {
              this.actionId = result.value;

              if (!this.selectedPatientEmail) {
                Swal.fire({
                  icon: 'error',
                  title: 'Erro',
                  text: 'Nenhum paciente selecionado.',
                });
                return;
              }

  
              this.patientService.confirmAction(this.actionId, this.selectedPatientEmail).subscribe({
                next: (confirmResponse: any) => {
                  console.log(confirmResponse);
                  Swal.fire({
                    title: 'Success!',
                    text: 'Data submitted successfully.',
                    icon: 'success',
                  });
                },
                error: (error) => {
                  console.error('Error:', error);
                  Swal.fire({
                    title: 'Error!',
                    text: `There was a problem submitting the data: ${error.message}`,
                    icon: 'error',
                  });
                },
              });
            }
          });
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Patient updated successfully!',
            confirmButtonText: 'Ok',
          });
        }
        this.viewPatient();
      },
      error: (error) => {
        console.error('Update error:', error);
        this.patientUpdateForm.markAllAsTouched();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.Message || 'An error occurred while updating the patient.',
        });
      },
    });
  }
  




  populateUpdateForm(): void {
    console.log('Patient Profile Single:', this.patientProfileSingle); 
    if (!this.patientProfileSingle) {
        console.error('Patient profile is not available');
        return; 
    }

    this.patientUpdateForm.patchValue({
      name: `${this.patientProfileSingle.name?.firstName || ''} ${this.patientProfileSingle.name?.middleNames || ''} ${this.patientProfileSingle.name?.lastName || ''}`.trim(),
      email: this.patientProfileSingle.email?.fullEmail || '',
      phone: this.patientProfileSingle.phone?.number || '',
      userEmail: this.patientProfileSingle.userEmail?.fullEmail || '',
      gender: this.patientProfileSingle.gender || '',
      emergencyContactName: this.patientProfileSingle.nameEmergency || '',
      emergencyContactEmail: this.patientProfileSingle.emailEmergency?.fullEmail || '',
      emergencyContactPhone: this.patientProfileSingle.phoneEmergency?.number || '',
    });
    

    const appointmentHistoryArray = this.patientUpdateForm.get('appointmentHistory') as FormArray;
    const allergiesArray = this.patientUpdateForm.get('allergies') as FormArray;
    appointmentHistoryArray.clear();
    allergiesArray.clear();
  
    // Popula o FormArray de appointmentHistory
    if (this.patientProfileSingle.appointmentHistory) {
      this.patientProfileSingle.appointmentHistory.forEach((appointment: string) => {
        appointmentHistoryArray.push(new FormControl(appointment));
      });
      this.appointmentHistory = [...this.patientProfileSingle.appointmentHistory]; // Sincroniza com o array local
    }
  

    if (this.patientProfileSingle.allergies) {
      this.patientProfileSingle.allergies.forEach((allergy: string) => {
        allergiesArray.push(new FormControl(allergy));
      });
      this.tags = [...this.patientProfileSingle.allergies]; 
    }

    
}





  ngOnInit() {
    const token = this.authService.getToken();

    if (!token) {
      console.log("abc");
      this.errorMessage = 'You are not logged in!';
      this.router.navigate(['/']);
    }

    this.viewPatient();     
  }


  viewPatient() {
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

    this.selectedPatientEmail = this.authService.getEmail();

    console.log(`Viewing Patient Email: ${this.selectedPatientEmail}`);

    // Faça a requisição para obter os dados do paciente
    if (this.selectedPatientEmail){
      this.patientService.getPatientByEmail(this.selectedPatientEmail)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.patientProfileSingle = response;

          this.populateUpdateForm();

        },
        error: (error) => {
          console.error('Error viewing patient:', error);
          this.errorMessage = 'Failed to view patient profile!';
        }
      });
    } else { this.errorMessage = 'No email provided!'; }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); 
  }


  deactivatePatient() {
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
      return;
    } else {
      if (document.getElementById("active_" + this.selectedPatientEmail + "_false")) {
        Swal.fire({
          icon: "error",
          title: "Perfil já está desativado.",
          toast: true,
          position: "bottom-right",
          timer: 3000,
          showConfirmButton: false
        });
        return;
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
        if (result.isConfirmed) {
          console.log(`Deactivating Patient Email: ${this.selectedPatientEmail}`);

          if (!this.selectedPatientEmail) {
            Swal.fire({
              icon: 'error',
              title: 'Erro',
              text: 'Nenhum paciente selecionado.',
            });
            return;
          }

          this.patientService.deactivatePatient(this.selectedPatientEmail).subscribe({
              next: (response: any) => {
                console.log(response);
  
                if (typeof response === 'string' && response.includes('Please check your email to confirm this action')) {
                  Swal.fire({
                    title: "Submit your code",
                    input: "text",
                    inputAttributes: {
                      autocapitalize: "off"
                    },
                    showCancelButton: true,
                    confirmButtonText: "Submit",
                    showLoaderOnConfirm: true,
                    preConfirm: (code) => {
                      if (!code) {
                        Swal.showValidationMessage('Please enter your code');
                      }
                      return code;
                    },
                    allowOutsideClick: () => !Swal.isLoading(),
                  }).then((result) => {
                    if (result.isConfirmed) {
                      this.actionId = result.value;
  
                      if (!this.selectedPatientEmail) {
                        Swal.fire({
                          icon: 'error',
                          title: 'Erro',
                          text: 'Nenhum paciente selecionado.',
                        });
                        return;
                      }
  
                      this.patientService.confirmDeactivateAction(this.actionId).subscribe({
                        next: (confirmResponse: any) => {
                          console.log(confirmResponse);
                          Swal.fire({
                            title: 'Success!',
                            text: 'Patient deleted successfully.',
                            icon: 'success',
                          });
                          this. logout()
                        }                      
                        ,
                        error: (error: any) => {
                          console.error('Error confirming action:', error);
                          Swal.fire({
                            icon: "error",
                            title: "Erro ao confirmar a ação",
                            text: 'Houve um erro ao confirmar a desativação.',
                          });
                        }
                      });
                    }
                  });
                }
              },
              error: (error: any) => {
                console.error('Error deactivating patient:', error);
                this.errorMessage = 'Failed to deactivate patient profiles!';
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
          // Action when 'Cancel' is pressed
        }
      });
    }
  }
  

 }


