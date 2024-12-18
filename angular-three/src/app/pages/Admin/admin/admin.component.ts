import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormArray, FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ModalService } from '../../../Services/modal.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { AppointmentService } from '../../../Services/appointment.service';
import { OperationTypesService } from '../../../Services/operationTypes.service.';
import { SpecializationService } from '../../../Services/specialization.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment'; // Importa o environment correto
import { StaffService } from '../../../Services/staff.service';
import { PatientService } from '../../../Services/patient.service';
import { AllergiesService } from '../../../Services/allergies.service';
import { MedicalConditionService } from '../../../Services/medicalCondition.service';

interface RequiredStaff {
  quantity: number;
  specialization: string;
  role: string;
}

interface EstimatedDuration {
  patientPreparation: string;
  surgery: string;
  cleaning: string;
}

interface CreatingSpecializationDto {
  specializationName: string;
  specializationDescription: string;
}

interface CreatingOperationTypeDto {
  name: string;
  requiredStaff: RequiredStaff[];
  estimatedDuration: EstimatedDuration;
}

interface PlanningModelDto {
  date: string;
  Prob_CrossOver: number ;
  Prob_Mutation: number ;
  N_Generations: number; 
  Base_Population: number; 
}

// or via CommonJS
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

  operationType: CreatingOperationTypeDto = {
    name: '',
    requiredStaff: [],
    estimatedDuration: {
      patientPreparation: '',
      surgery: '',
      cleaning: ''
    }
  };

  specialization: CreatingSpecializationDto = {
    specializationName:  '' ,
    specializationDescription:'' 
  };


  scheduleDate: string = '';
  probCrossOver: number = 0.50;
  probMutation: number = 0.50;
  nGenerations: number = 6;
  basePopulation: number = 6;


  minDate: string = '';

  scheduledAppointmentMessage: string = '';

   
  constructor(
    private fb: FormBuilder, 
    private modalService: ModalService,
    private allergiesService: AllergiesService,
    private medicalConditionService: MedicalConditionService,
    private http: HttpClient, private authService: AuthService, private operationTypesService: OperationTypesService, private specializationService: SpecializationService,private appointmentService : AppointmentService , private patientService: PatientService, private staffService: StaffService,
    private router: Router) {
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
      //agree: [false, Validators.requiredTrue]
    });

    this.patientUpdateForm = this.fb.group({
      name: ['', Validators.required],
      userEmail: ['', [Validators.required, Validators.email]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      gender: ['', Validators.required],
      nameEmergency: ['', Validators.required],
      emailEmergency: ['', [Validators.required, Validators.email]],
      phoneEmergency: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      //agree: [false, Validators.requiredTrue],
      appointmentHistory: this.fb.array([]),
      allergies: this.fb.array([])
    });

    this.operationTypeUpdateForm = this.fb.group({
      name: ['', Validators.required],
      estimatedDuration: this.fb.group({
        cleaning: ['', Validators.required],
        patientPreparation: ['', Validators.required],
        surgery: ['', Validators.required],
      }),
      requiredStaff: this.fb.array([]),
    });

    this.allergieForm = this.fb.group({
      designacao: ['', Validators.required],
      descricao: ['', Validators.required],
    });

    this.medicalConditionForm = this.fb.group({
      codigo: ['', Validators.required],
      descricao: ['', Validators.required],
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

  selectedStaffId: string | null = null;
  selectOperationTypeId: string | null = null;
  selectedPatientEmail: string | null = null;

  selectStaff(id: string) {
    this.selectedStaffId = this.selectedStaffId === id ? null : id;
  }


  selectPatient(email: string) {
    this.selectedPatientEmail = this.selectedPatientEmail === email ? null : email;
  }

  selectOperationType(id: string) {
    this.selectOperationTypeId = this.selectOperationTypeId === id ? null : id;
  }


  myForm: FormGroup;
  patientUpdateForm!: FormGroup;
  operationTypeUpdateForm!: FormGroup;
  allergieForm!: FormGroup;
  medicalConditionForm!: FormGroup;
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
  OperationTypesProfiles: any[] = [];
  Specializations: any[] = [];
  OperationTypeSingle: any = null;
  requiredStaffView: any[] = [];
  staffProfileSingle: any = null;
  patientProfileSingle: any = null;
  patientProfileUpdate: any = null;
  operationTypeUpdate: any = null;
  availabilitySlots: any[] = [];
  availabilitySlots2: any[] = [];
  availabilitySlots3: any[] = [];
  searchTerm: string = '';
  filterField: string = '';
  appointmentHistory: string[] = [];
  slots: string[] = [];


  filteredPatients: any[] = [];
  filter = {
    name: '',
    email: '',
    dateOfBirth: '',
    medicalRecordNumber: '',
    allergies: '',
    appointmentHistory: ''
  } as const;

  filteredStaffs: any[] = [];
  filterStaff = {
    name: '',
    phone: '',
    license: '',
    role: '',
    specialization: '',
  } as const;

  
  filteredOperationTypes: any[] = [];
  filterOperationTypes = {
    specialization: '',
    status: ''    
  } as const;

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

  addStaff() {
    this.operationType.requiredStaff.push({ quantity: 1, specialization: '', role: '' });
  }

   // Remove a staff member from the requiredStaff array
   removeStaff(index: number) {
    this.operationType.requiredStaff.splice(index, 1);
  }

  formatDateToISO(date: string | Date): string {
    if (!date) return ''; // Evita erros caso a data seja nula
    const parsedDate = new Date(date);
    return parsedDate.toISOString().split('T')[0];
  }


  formatTimeToISO(time: string): string {
    if (!time) return ''; // Return an empty strig if no value exists

    // If the time is already in "HH:mm:ss" format, return it
    const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/; // Matches "HH:mm" or "HH:mm:ss"
    if (timeRegex.test(time)) {
      return time;
    }

    try {
      // Convert the time to a valid ISO string (assuming "HH:mm:ss" format)
      const [hours, minutes, seconds] = time.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, seconds || 0, 0); // Default seconds to 0 if not provided
      return date.toISOString().slice(11, 19); // Extract "HH:mm:ss" part
    } catch (error) {
      console.error('Invalid time format:', time, error);
      return 'Invalid Time';
    }
  }

  setMinDate(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.minDate = `${year}-${month}-${day}`;
  }

  onScheduleAppointment(scheduleData : PlanningModelDto) {
    const token = this.authService.getToken();
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'You are not logged in!',
      });
      return;
    }

    if (!scheduleData.date) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Date',
        text: 'Please select a valid date.',
      });
      return;
    }

    const payload: PlanningModelDto = {
      date: scheduleData.date,
      Prob_CrossOver: scheduleData.Prob_CrossOver,
      Prob_Mutation: scheduleData.Prob_Mutation,
      N_Generations: scheduleData.N_Generations,
      Base_Population: scheduleData.Base_Population,
    };

    this.appointmentService.scheduleAppointments(payload).subscribe({
      next: (response: any) => {
        this.scheduledAppointmentMessage = response.message.replace(/\n/g, '<br>');

        if (this.scheduledAppointmentMessage == null || this.scheduledAppointmentMessage == '') {
          Swal.fire({
            icon: 'warning',
            title: 'No Data in the System for the designated date',
            text: 'Please select a valid date.',
          });
        }else{

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Appointment scheduled successfully!',
          showConfirmButton: false,
          timer: 1500,
        });}
      },
      error: (error) => {
        console.error('Error scheduling appointment:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to schedule appointment.',
        });
      },
    });
  }

  onCreateOperationType(operationTypeData: CreatingOperationTypeDto) {
    const token = this.authService.getToken();

    // Check if the user is logged in
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'You are not logged in!',
      });
      return;
    }

    const payload: CreatingOperationTypeDto = {
      name: operationTypeData.name,
      requiredStaff: operationTypeData.requiredStaff,
      estimatedDuration: operationTypeData.estimatedDuration
    };

    // Send a POST request to create the operation type
    this.operationTypesService.createOperationTypes(payload)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Operation Type created successfully!',
            showConfirmButton: false,
            timer: 1500
          });

          // Close the modal after success
          this.getAllOperationTypes();
          this.modalService.closeModal('createOperationTypeModal');
        },
        error: (error) => {
          console.error('Error creating operation type:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to create Operation Type.',
          });
        }
      });
  }


  onCreateSpecialization(specializationData: CreatingSpecializationDto) {
    const token = this.authService.getToken();

    // Check if the user is logged in
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'You are not logged in!',
      });
      return;
    }

    const payload: CreatingSpecializationDto = {
      specializationName: specializationData.specializationName,
      specializationDescription: specializationData.specializationDescription
    };

    // Send a POST request to create the operation type
    this.specializationService.createSpecialization(payload)
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Specialization created successfully!',
            showConfirmButton: false,
            timer: 1500
          });

          // Close the modal after success
          this.modalService.closeModal('createSpecializationModal');
        },
        error: (error) => {
          console.error('Error creating operation type:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to create Specialization.',
          });
        }
      });
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
      

      // Enviar os dados diretamente com HttpClient
  
     // this.http.post(apiUrl, formData, { headers })
     this.patientService.adminRegisterPatient(formData)
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
            this.getAllpatientsProfiles();
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
          //this.http.delete<string>(`${this.staffUrl}/${this.selectedStaffId}`, { headers })

          if (!this.selectedStaffId) {
            Swal.fire({
              icon: 'error',
              title: 'Erro',
              text: 'Nenhum paciente selecionado.',
            });
            return;
          }      

          this.staffService.deactivateStaff(this.selectedStaffId)
          .subscribe({
            next: (response) => {
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
     // this.http.get<string>(`${this.staffUrl}/${this.selectedStaffId}`, { headers })
      this.staffService.viewStaff(this.selectedStaffId)
      .subscribe({
        next: (response) => {
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
      //this.http.get<string>(`${this.patientUrl}/email/${this.selectedPatientEmail}`, { headers })
      this.patientService.adminGetPatient(this.selectedPatientEmail)
      .subscribe({
        next: (response) => {
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
        nameEmergency: this.patientProfileUpdate.nameEmergency,
        emailEmergency: this.patientProfileUpdate.emailEmergency.fullEmail,
        phoneEmergency: this.patientProfileUpdate.phoneEmergency.number,


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


    if (!this.selectedPatientEmail) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Nenhum paciente selecionado.',
      });
      return;
    }

    const updatedPatientData = this.patientUpdateForm.value;

    this.patientService.adminUpdatePatient(this.selectedPatientEmail, updatedPatientData )
      .subscribe({
        next: (response: any) => {
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



  onFilterRequests(){
    this.getAllpatientsProfiles();
    this.closeModal('filterRequestModal');
  }

  cleanFilter() {
    this.filter = {
      name: '',
      email: '',
      medicalRecordNumber: '',
      dateOfBirth: '',
      allergies: '',
      appointmentHistory: ''
    };
  }

  onFilterStaff(){
    this.getAllstaffsProfiles();
    this.closeModal('filterStaffModal');
  }

  cleanFilterStaff() {
    this.filterStaff = {
      name: '',
      phone: '',
      license: '',
      role: '',
      specialization: '',
    };
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

          if (!this.selectedPatientEmail) {
            Swal.fire({
              icon: 'error',
              title: 'Erro',
              text: 'Nenhum paciente selecionado.',
            });
            return;
          }

          console.log(`Deactivating Patient Email: ${this.selectedPatientEmail}`);
          //this.http.delete<string>(`${this.patientUrl}/${this.selectedPatientEmail}`, { headers })
          this.patientService.adminDeletePatient(this.selectedPatientEmail)
          .subscribe({
            next: (response) => {
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
     // this.http.get<string>(`${this.patientUrl}/email/${this.selectedPatientEmail}`, { headers })
      this.patientService.adminGetPatient(this.selectedPatientEmail)
      .subscribe({
        next: (response) => {
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
      //this.http.get<string>(`${this.staffUrl}/${this.selectedStaffId}`, { headers })
      this.staffService.viewStaff(this.selectedStaffId)
      .subscribe({
        next: (response) => {
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
    
    //this.http.put(`${this.staffUrl}/${this.selectedStaffId}/SlotsAdd`, JSON.stringify(formDataA).replaceAll("Time",""), { headers })

    if (!this.selectedStaffId) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Nenhum paciente selecionado.',
      });
      return;
    }

    this.staffService.editStaffPostB(this.selectedStaffId, formDataA)
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

      //this.http.put(`${this.staffUrl}/${this.selectedStaffId}/SlotsRemove`, JSON.stringify(formDataB).replaceAll("Time",""), { headers })
      this.staffService.removeStaffPostB(this.selectedStaffId, formDataB)
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
    //this.http.put(`${this.staffUrl}/${this.selectedStaffId}`, JSON.stringify(formData), { headers })
    this.staffService.editStaffPostA(this.selectedStaffId, formData)  
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
      this.errorMessage = 'You are not logged in!';
      this.router.navigate(['/']);
    }
    this.getAllpatientsProfiles(); // Fetch all profiles on component initialization
    this.getAllstaffsProfiles();
    this.getAllOperationTypes();
    this.setMinDate();

      if (!this.operationTypeUpdateForm.get('requiredStaff')) {
        this.operationTypeUpdateForm.addControl('requiredStaff', this.fb.array([]));
      }
  }

  // Novo método para atualizar a lista ao mudar o filtro
  onFilterChange() {
    this.getAllpatientsProfiles();
  }

  onFilterStaffChange() {
    this.getAllstaffsProfiles();
  }

  onFilterOperationTypesChange() {
    this.getAllOperationTypes();
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


    type FilterKeys = keyof typeof this.filter; // Restringe as chaves às do objeto filter


    let params = new HttpParams();

  Object.keys(this.filter).forEach(key => {
    const typedKey = key as FilterKeys; // Converter a chave para o tipo correto
    const value = this.filter[typedKey]; // Acessar o valor usando a chave tipada
    if (value) { // Só adiciona se o valor estiver preenchido
      params = params.set(key, value);
    }
  });

    /*const params = new HttpParams()
  .set(this.filterField.toLowerCase().replace(/\s+/g, '')  // Converte para minúsculas e remove os espaços
, this.searchTerm || '');*/



    //this.http.get<any[]>(`${this.patientUrl}/search`, { headers, params })
    this.patientService.getAllPatientProfiles(params)
      .subscribe({
        next: (response) => {
          this.patientsProfiles = response;
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

    type FilterKeys = keyof typeof this.filterStaff; // Restringe as chaves às do objeto filter


    let params = new HttpParams();

  Object.keys(this.filterStaff).forEach(key => {
    const typedKey = key as FilterKeys; // Converter a chave para o tipo correto
    const value = this.filterStaff[typedKey].toLowerCase().replace(/\s+/g, ''); // Acessar o valor usando a chave tipada
    if (value) { // Só adiciona se o valor estiver preenchido
      params = params.set(key, value);
    }
  });

    /*const params = new HttpParams()
  .set(this.filterField.toLowerCase().replace(/\s+/g, '')  // Converte para minúsculas e remove os espaços
, this.searchTerm || '');*/



    //this.http.get<any[]>(`${this.staffUrl}`, { headers, params })
    this.staffService.getStaff(params)
      .subscribe({
        next: (response) => {
          this.staffsProfiles = response;
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
   

    //this.http.post(`${environment.apiBaseUrl}/Staff`, JSON.stringify(formData), { headers })
    this.staffService.createStaff(formData)
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
            title: "Não foi possível criar o Perfil\n"+error.error.message,
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

  onSubmitOperationTypes(){}

  getAllOperationTypes() {
    const token = this.authService.getToken();

    if (!token) {
      this.errorMessage = 'You are not logged in!';
      return;
    }

    type FilterKeys = keyof typeof this.filterOperationTypes; // Restringe as chaves às do objeto filter


    let params = new HttpParams();

    Object.keys(this.filterOperationTypes).forEach(key => {
    const typedKey = key as FilterKeys; // Converter a chave para o tipo correto
    const value = this.filterOperationTypes[typedKey]; // Acessar o valor usando a chave tipada
    if (value) { // Só adiciona se o valor estiver preenchido
      params = params.set(key, value);
    }
    });


    this.operationTypesService.getSearchOperationTypes(params)
      .subscribe({
        next: (response) => {
          console.log('Operation Type ',response);

          this.OperationTypesProfiles = response;
          console.log("params Operation Types: ", params);
        },
        error: (error) => {
          console.error('Error fetching  profiles:', error);
          this.errorMessage = 'Failed to fetch patients profiles!';
        }
      });
  }


  onFilterOperationTypesRequests(){
    this.getAllOperationTypes();
    this.closeModal('filterOperationTypesRequestModal');
  }

  cleanOperationTypesFilter() {
    this.filterOperationTypes = {
      specialization: '',
      status: ''
    };
  }


  viewOperationTypes(){
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
    if (this.selectOperationTypeId === null) {
      Swal.fire({
        icon: "warning",
        title: "Por favor seleciona um Operation Type.",
        toast: true,
        position: "bottom-right",
        timer: 3000,
        showConfirmButton: false
      });

    } else {
      console.log(`Viewing Operation Type Id: ${this.selectOperationTypeId}`);
      this.operationTypesService.getOperationTypeById(this.selectOperationTypeId)
      .subscribe({
        next: (response) => {
          this.OperationTypeSingle = response;

          this.operationType = {
            name: response.name || "",
            requiredStaff: response.requiredStaff || [],
            estimatedDuration: {
              patientPreparation: response.estimatedDuration?.patientPreparation || "",
              surgery: response.estimatedDuration?.surgery || "",
              cleaning: response.estimatedDuration?.cleaning || "",
            },
          };

          this.requiredStaffView =  response.requiredStaff;

          this.openModal('viewOperationTypeModal');
        },
        error: (error) => {
          console.error('Error viewing operation type:', error);
          this.errorMessage = 'Failed to view operation type profile!';
        }
      });
    }
  }

  get GetrequiredStaff(): FormArray {
    return this.operationTypeUpdateForm.get('requiredStaff') as FormArray;
  }

  populateOperationTUpdateForm(estimatedDuration: EstimatedDuration): void {

    this.operationTypeUpdateForm.patchValue({
        name: this.operationTypeUpdate.name,
        estimatedDuration: estimatedDuration


    });


    

    const requiredStaffControl = this.GetrequiredStaff;
    
    requiredStaffControl.clear(); // Limpar quaisquer dados antigos no FormArray
  
    
    this.operationTypeUpdate.requiredStaff.forEach((staff: any) => {
      requiredStaffControl.push(this.createStaffGroup(staff));
    });

  


    //TODO: Fazer o array dos required staff atualizar automaticamente e ir buscar o codigo de adicionar o staff

  }

  // Método para criar um FormGroup para cada membro da equipe
  createStaffGroup(staff: any): FormGroup {
    
    return this.fb.group({
      quantity: [staff.quantity, Validators.required],
      specialization: [staff.specialization, Validators.required],
      role: [staff.role, Validators.required]
    });
  }

  // Método para adicionar um novo membro da equipe
  addRequiredStaff() {
    const requiredStaffArray = this.operationTypeUpdateForm.get('requiredStaff') as FormArray;
    requiredStaffArray.push(this.createStaffGroup({ quantity: '', specialization: '', role: '' }));
  }

  // Método para remover um membro da equipe
  removeRequiredStaff(index: number) {
    const requiredStaffArray = this.operationTypeUpdateForm.get('requiredStaff') as FormArray;
    requiredStaffArray.removeAt(index);

  }


  editOperationType(){


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
    if (this.selectOperationTypeId === null) {
      Swal.fire({
        icon: "warning",
        title: "Por favor seleciona uma Operation Type.",
        toast: true,
        position: "bottom-right",
        timer: 3000,
        showConfirmButton: false
      });
    }else {
      console.log(`Viewing Operation Type Id: ${this.selectOperationTypeId}`);
      this.operationTypesService.getOperationTypeById(this.selectOperationTypeId)
      .subscribe({
        next: (response) => {

          this.operationTypeUpdate = response;
          this.populateOperationTUpdateForm(response.estimatedDuration);


          const updateOpertTypeData = this.operationTypeUpdateForm.value;
          console.log('Updated Operation Type Data:', updateOpertTypeData);
          this.openModal('UpdateOperationTypeModal');
        },
        error: (error) => {
          console.error('Error getting operation type:', error);
          this.errorMessage = 'Failed to getting operation type!';
        }
      });
    }



  }

  formatTimeToZeroZero(time: string): string {
    // Verifica se o valor do tempo tem o formato "HH:mm:ss"
    if (time.includes(":")) {
      const timeParts = time.split(":");
  
      // Se o tempo tiver apenas "HH:mm", adiciona ":00" para completar
      if (timeParts.length === 2) {
        time += ":00";
      }
    } else {
      // Se não tiver o caractere ":", então retorna o valor sem mudanças
      return time;
    }
  
    // Retorna o valor já formatado como "HH:mm:ss"
    return time;
  }
  

  


  onUpdateOperationType() {

    const token = this.authService.getToken();

    if (!token) {
      this.errorMessage = 'You are not logged in!';
      return;
    }


    if (!this.selectOperationTypeId) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Nenhum operation type selecionado.',
      });
      return;
    }


    //console.log('before update:',this.operationTypeUpdateForm.value);

    const upForm = this.operationTypeUpdateForm.value.estimatedDuration;

    upForm.patientPreparation = this.formatTimeToZeroZero(upForm.patientPreparation)
    upForm.surgery = this.formatTimeToZeroZero(upForm.surgery)
    upForm.cleaning = this.formatTimeToZeroZero(upForm.cleaning)



    /*this.operationTypeUpdateForm.value.estimatedDuration.patientPreparation += ":00";
    this.operationTypeUpdateForm.value.estimatedDuration.surgery += ":00";
    this.operationTypeUpdateForm.value.estimatedDuration.cleaning += ":00";*/
    
    
    this.operationTypesService.UpdateOperationType(this.selectOperationTypeId,this.operationTypeUpdateForm.value)
      
    .subscribe({
        next: (response: any) => {
          //this.successMessage = 'Time Slots Added!';
          //this.errorMessage = null;
          Swal.fire({
            icon: "success",
            title: "Operation Type atualizado com sucesso!",
            toast: true,
            position: "top-end",
            timer: 3000,
            showConfirmButton: false
          });
          this.getAllOperationTypes(); // Refresh the list after creation
          this.closeModal('UpdateOperationTypeModal');
        },
        error: (error) => {
          console.error('Error editing Operation Type:', error);
      
          if (error.status === 400) {
            // Erro 400 específico
            Swal.fire({
              icon: "error",
              title: "Não podes editar um operation type desativado ou com campos vazios",
              toast: true,
              position: "top-end",
              timer: 3000,
              showConfirmButton: false,
            });
          } else {
            // Outros erros
            Swal.fire({
              icon: "error",
              title: "Não foi possível atualizar o operation type.",
              toast: true,
              position: "top-end",
              timer: 3000,
              showConfirmButton: false,
            });
          }
      
        },
      });
  }









  removeOperationType(){
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
    if (this.selectOperationTypeId === null) {
      Swal.fire({
        icon: "warning",
        title: "Por favor seleciona um Operation Type.",
        toast: true,
        position: "bottom-right",
        timer: 3000,
        showConfirmButton: false
      });

    } else {

      if (document.getElementById("active_"+this.selectOperationTypeId+"_false")){
        Swal.fire({
          icon: "error",
          title: "Operação já está desativada.",
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
        title: "Desativar esta operação?",
        text: "Não é possível reverter esta decisão.",
        showCancelButton: true,
        confirmButtonText: "Desativar",
        confirmButtonColor: "#d33",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {


      console.log(`Viewing Operation Type Id: ${this.selectOperationTypeId}`);

      if(this.selectOperationTypeId)

      this.operationTypesService.InactivateAsync(this.selectOperationTypeId)
      .subscribe({
        next: (response) => {
          Swal.fire({
            icon: "success",
            title: "Tipo de operação desativado",
            toast: true,
            position: "top-end",
            timer: 3000,
            showConfirmButton: false
          });

          this.getAllOperationTypes();

        },
        error: (error) => {
          console.error('Error viewing operation type:', error);
          this.errorMessage = 'Failed to view operation type profile!';
          Swal.fire({
            icon: "error",
            title: "Não foi possível desativar o tipo de operação",
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

















  onInsertMedicalCondition(){
    const token = this.authService.getToken();

    // Check if the user is logged in
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'You are not logged in!',
      });
      return;
    }
    const formData = this.medicalConditionForm.value;
    console.log(formData);

    this.medicalConditionService.createMedicalCondition(formData)
    .subscribe({
      next: (response) => {

        Swal.fire({
          icon: "success",
          title: "Medical condition registered successfully",
          toast: true,
          position: "top-end",
          timer: 3000,
          showConfirmButton: false
        });

        this.modalService.closeModal('insertMedicalCondition');

      },
      error: (error) => {
        console.error('Error fetched:', error);
        this.errorMessage = 'Failed to register a medical condition  !';
        Swal.fire({
          icon: "error",
          title: "There is already a medical condition with this name",
          //It was not possible create the allergie
          toast: true,
          position: "top-end",
          timer: 3000,
          showConfirmButton: false
        });

        
      }
    });
  }

  onInsertAllergie(){
    
    const token = this.authService.getToken();

    // Check if the user is logged in
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'You are not logged in!',
      });
      return;
    }


    const formData = this.allergieForm.value;

    this.allergiesService.insertAllergies(formData)
      .subscribe({
        next: (response) => {

          Swal.fire({
            icon: "success",
            title: "Allergie created with success",
            toast: true,
            position: "top-end",
            timer: 3000,
            showConfirmButton: false
          });

          this.modalService.closeModal('insertAllergies');

        },
        error: (error) => {
          console.error('Error fetched:', error);
          this.errorMessage = 'Failed to create a allergie  !';
          Swal.fire({
            icon: "error",
            title: "Already exist a allergie with this name",
            //It was not possible create the allergie
            toast: true,
            position: "top-end",
            timer: 3000,
            showConfirmButton: false
          });

          
        }
      });

  }











  onSubmitSpecializations() {}











  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); 
  }


}
