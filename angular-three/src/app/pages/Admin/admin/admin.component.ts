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
import { sweetAlertService } from '../../../Services/sweetAlert.service';
import { MedicalRecordService } from '../../../Services/medicalRecordservice';
import { RoomTypesService } from '../../../Services/roomtypes.service';

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

interface SpecializationUIDto {
  SpecializationName: string;
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


interface IAllergieMedicalRecord {
  designacao: string;
  descricao: string;
  status: string;
  _id?: string;
}

export interface IMedicalConditionMedicalRecord {
  codigo: string;
  designacao: string;
  descricao: string;
  sintomas: string[];
  status: string;
  _id?: string;
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

  specializations: SpecializationUIDto[] = [];

  selectedSpecialization: string | null = null;

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
    private roomTypesService: RoomTypesService,
    private medicalConditionService: MedicalConditionService,
    private http: HttpClient,
    private authService: AuthService,
    private operationTypesService: OperationTypesService,
    private specializationService: SpecializationService,
    private appointmentService : AppointmentService ,
    private patientService: PatientService,
    private medicalRecordService: MedicalRecordService,
    private staffService: StaffService,
    private sweetService : sweetAlertService,
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
     // allergies: [''], // Controlador para o campo de "Allergies"
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


    this.allergyUpdateForm = this.fb.group({
      designacao: [''],
      descricao: [''],
    });


    this.roomTypeForm = this.fb.group({
      code: ['', Validators.required],
      designacao: ['', Validators.required],
      descricao: ['', Validators.required],
      surgerySuitable: [false]
    });


    this.medicalConditionForm = this.fb.group({
      codigo: ['', Validators.required],
      designacao: ['', Validators.required],
      descricao: ['', Validators.required],
      sintomas: ['', Validators.required]
    });

    this.medicalConditionEditForm = this.fb.group({
      designacao: ['', Validators.required],
      descricao: ['', Validators.required],
      sintomas: ['', Validators.required]
    });
    this.specializationEditForm = this.fb.group({
      id: ['', Validators.required],      
      SpecializationName: ['', Validators.required],
      SpecializationDescription: ['', Validators.required]
    })


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
  selectSpecializationsId: string | null = null;
  selectConditionId: string | null = null;

  selectStaff(id: string) {
    this.selectedStaffId = this.selectedStaffId === id ? null : id;
  }


  selectPatient(email: string) {
    this.selectedPatientEmail = this.selectedPatientEmail === email ? null : email;
  }

  selectOperationType(id: string) {
    this.selectOperationTypeId = this.selectOperationTypeId === id ? null : id;
  }

  selectSpecializations(id: string) {
    this.selectSpecializationsId = this.selectSpecializationsId === id ? null : id;
  }

  selectCondition(id: string) {
    this.selectConditionId = this.selectConditionId === id ? null : id;
  }


  

  myForm: FormGroup;
  patientUpdateForm!: FormGroup;
  operationTypeUpdateForm!: FormGroup;
  allergyUpdateForm!: FormGroup;
  allergieForm!: FormGroup;
  allergyUpdate: any = null;
  roomTypeForm!: FormGroup;
  medicalConditionForm!: FormGroup;
  medicalConditionEditForm!: FormGroup;
  specializationEditForm: FormGroup;
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
  Specializations: any[] = [];
  Conditions: any[] = [];
  staffsProfiles: any[] = [];
  OperationTypesProfiles: any[] = [];
  OperationTypeSingle: any = null;
  requiredStaffView: any[] = [];
  staffProfileSingle: any = null;
  MedicalConditionSingle: any = null;
  SpecializationSingle: any = null;
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
  allergiesList: any[] = [];

  medicalRecordProfile: any = null;
  tagsConditions: IMedicalConditionMedicalRecord[] = [];
  tagsAllergies: IAllergieMedicalRecord[] = [];
  descricaoList : string[] = [];


  filteredPatients: any[] = [];
  filter = {
    name: '',
    email: '',
    dateOfBirth: '',
    medicalRecordNumber: '',
    allergies: '',
    appointmentHistory: ''
  } as const;

  filteredAllergies: any[] = [];
  filterAllergy = {
    name: '',
    description: '',
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

  isPolicyAccepted = false; 
  showPolicyModal = false; 

    
  openPolicyModal() {
    this.showPolicyModal = true;
  }

  closePolicyModal() {
    this.showPolicyModal = false;
  }

  acceptPolicy() {
    this.isPolicyAccepted = true;
    this.closePolicyModal();
  }

  rejectPolicy() {
    this.isPolicyAccepted = false;
    this.closePolicyModal();
  }



  openModal(modalId: string): void {
    this.modalService.openModal(modalId);
  }

  closeModal(modalId: string): void {
    this.modalService.closeModal(modalId);
    this.rejectPolicy();
  }

  isModalOpen(modalId: string): boolean {
    return this.modalService.isModalOpen(modalId);
  }

  newStaff = {
    quantity: 0,
    specialization: '',
    role: '',
  };
  
  addStaff1() {
    if (
      this.newStaff.quantity > 0 &&
      this.newStaff.specialization &&
      this.newStaff.role
    ) {
      this.operationType.requiredStaff.push({ ...this.newStaff });
      this.newStaff = { quantity: 0, specialization: '', role: '' }; // Reset fields
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Required Staff Error',
        text: 'Please fill all fields with valid values!',
      });    }
  }
  
  removeStaff1(index: number) {
    this.operationType.requiredStaff.splice(index, 1);
  }

  addStaff() {
    this.operationType.requiredStaff.push({ quantity: 1, specialization: '', role: ''});
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

        this.rejectPolicy();
        if (this.scheduledAppointmentMessage == null || this.scheduledAppointmentMessage == '') {
          Swal.fire({
            icon: 'warning',
            title: 'No Data in the System for the designated date',
            text: 'Please select a valid date.',
          });
        }else{

        }
      },
      error: (error) => {
        this.rejectPolicy();
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

    this.operationTypesService.createOperationTypes(payload)
      .subscribe({
        next: () => {
          this.sweetService.sweetSuccess('Operation Type created successfully!')

          this.rejectPolicy();
          this.getAllOperationTypes();
          this.modalService.closeModal('createOperationTypeModal');
        },
        error: (error) => {
          this.rejectPolicy();
          console.error('Error creating operation type:', error);
          this.sweetService.sweetErro('Failed to create Operation Type.')
        }
      });
  }


  onCreateSpecialization(specializationData: CreatingSpecializationDto) {
    const token = this.authService.getToken();

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

    this.rejectPolicy();
    this.specializationService.createSpecialization(payload)
      .subscribe({
        next: () => {
          this.sweetService.sweetSuccess('Specialization created successfully!')

          this.modalService.closeModal('createSpecializationModal');
        },
        error: (error) => {
          this.rejectPolicy();
          console.error('Error creating operation type:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to create Specialization.',
          });
        }
      });
  }


  getAllSelectableSpecialization() {
    const token = this.authService.getToken();
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'You are not logged in!',
      });
      return;
    }

    this.specializationService.getAllSpecializations().subscribe({
      next: (response: SpecializationUIDto[]) => {
        console.log('Selectable Specializations:', response);
        this.specializations = response;
      },
      error: (error) => {
        console.error('Error fetching requests:', error);
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

      this.myForm.patchValue({ appointmentHistory: this.appointmentHistory });

      // Obtém os valores do formulário
      const formData = this.myForm.value;



     // this.http.post(apiUrl, formData, { headers })
     this.patientService.adminRegisterPatient(formData)
        .subscribe(
          response => {
            this.rejectPolicy();

            this.sweetService.sweetSuccess("Patient adicionado com sucesso!")
            this.myForm.reset(); // Redefinir o formulário após o envio
            this.appointmentHistory = []; // Limpar o array de tags após o envio
            this.getAllpatientsProfiles();
          },
          error => {
            this.rejectPolicy();

            console.error("Erro ao submeter o formulário", error);
              console.error('Error editing patient:', error);
              this.sweetService.sweetErro("Não foi possível adicionar o patient devido a algum atributo")
              this.errorMessage = 'Failed to edit patient!';
              this.successMessage = null;
          }
        );
    } else {
      this.rejectPolicy();

      this.myForm.markAllAsTouched();
      console.log("Formulário inválido");
    }
  }

  onSubmitPatient(){}

  onSubmitStaff(){}
  deactivateStaff(){
    const token = this.authService.getToken();

    if (!token) {
      this.sweetService.sweetErro("Nenhuma conta com sessão ativa.")
      this.errorMessage = 'You are not logged in!';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    if (this.selectedStaffId === null) {
      this.sweetService.sweetWarning("Por favor seleciona um membro de Staff.")
    } else {
      if (document.getElementById("active_"+this.selectedStaffId)?.innerText == "false"){
        this.sweetService.sweetErro("Perfil já está desativado.")
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
              this.sweetService.sweetSuccess("Perfil desativado com sucesso")
            },
            error: (error) => {
              console.error('Error deactivating staff:', error);
              this.errorMessage = 'Failed to deactivate staff profiles!';
              this.sweetService.sweetErro("Não foi possível desativar o perfil")
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
      this.sweetService.sweetErro("Nenhuma conta com sessão ativa.")
      this.errorMessage = 'You are not logged in!';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    if (this.selectedStaffId === null) {

      this.sweetService.sweetWarning("Por favor seleciona um membro de Staff.")
    
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
      
      this.sweetService.sweetErro("Nenhuma conta com sessão ativa.")

      this.errorMessage = 'You are not logged in!';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    if (this.selectedPatientEmail === null) {
      this.sweetService.sweetWarning("Por favor seleciona um Patient.");
    }else {
      console.log(`Viewing Patient Email: ${this.selectedPatientEmail}`);
      //this.http.get<string>(`${this.patientUrl}/email/${this.selectedPatientEmail}`, { headers })
      this.patientService.adminGetPatient(this.selectedPatientEmail)
      .subscribe({
        next: (response) => {
          this.rejectPolicy();

          this.patientProfileUpdate = response;

          this.populateUpdateForm();


          const updatedPatientData = this.patientUpdateForm.value;
          console.log('Updated Patient Data:', updatedPatientData);
          this.openModal('UpdatePatientModal');
        },
        error: (error) => {
          this.rejectPolicy();

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
          this.rejectPolicy();

          this.sweetService.sweetSuccess("Patient atualizado com sucesso!");

          this.getAllpatientsProfiles(); // Refresh the list after creation
          this.closeModal('UpdatePatientModal');
        },
        error: (error) => {
          this.rejectPolicy();

          console.error('Error editing patient:', error);
          this.sweetService.sweetErro("Não foi possível atualizar o patient");
          this.errorMessage = 'Failed to edit patient!';
          this.successMessage = null;
        }
      });
  }

  onEditSpecialization(){

    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'You are not logged in!';
      return;
    }
    if (!this.selectSpecializationsId) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Nenhum paciente selecionado.',
      });
      return;
    }
    const updatedPatientData = this.specializationEditForm.value;

    this.specializationService.updateSpecialization(this.selectSpecializationsId, updatedPatientData )
      .subscribe({
        next: (response: any) => {
          //this.successMessage = 'Time Slots Added!';
          //this.errorMessage = null;
          this.sweetService.sweetSuccess("Specialization atualizado com sucesso!");

          this.getAllpatientsProfiles(); // Refresh the list after creation
          this.closeModal('EditSpecializationModal');
        },
        error: (error) => {
          console.error('Error editing Specialization:', error);
          this.sweetService.sweetErro("Não foi possível atualizar o Specialization");
          this.errorMessage = 'Failed to edit Specialization!';
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


  onFilterAllergies(){
    this.getAllAllergies();
    this.closeModal('filterAllergyModal');
  }

  cleanFilterAllergy() {
    this.filterAllergy = {
      name: '',
      description: '',
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
      this.sweetService.sweetErro("Nenhuma conta com sessão ativa.");
      this.errorMessage = 'You are not logged in!';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    if (this.selectedPatientEmail === null) {
      this.sweetService.sweetWarning("Por favor seleciona um Patient.")
    } else {
      if (document.getElementById("active_"+this.selectedPatientEmail+"_false")){
        this.sweetService.sweetErro("Perfil já está desativado.")
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
              this.rejectPolicy();

              this.getAllpatientsProfiles();
              this.sweetService.sweetSuccess("Perfil desativado com sucesso")

            },
            error: (error) => {
              this.rejectPolicy();

              console.error('Error deactivating staff:', error);
              this.errorMessage = 'Failed to deactivate staff profiles!';
              this.sweetService.sweetErro("Não foi possível desativar o perfil")
            }
          });
        } else if (result.isDenied) {
          this.rejectPolicy();          
        }
      });

    }
  }




  viewPatient(){
    const token = this.authService.getToken();

    if (!token) {
      this.sweetService.sweetErro("Nenhuma conta com sessão ativa.")
      this.errorMessage = 'You are not logged in!';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    if (this.selectedPatientEmail === null) {
      this.sweetService.sweetWarning("Por favor seleciona um Patient.")

    } else {
      console.log(`Viewing Patient Email: ${this.selectedPatientEmail}`);
     // this.http.get<string>(`${this.patientUrl}/email/${this.selectedPatientEmail}`, { headers })
      this.patientService.adminGetPatient(this.selectedPatientEmail)
      .subscribe({
        next: (response) => {
          this.patientProfileSingle = response;

          this.medicalRecordService.getAllMedicalRecordByPatientId(this.patientProfileSingle.id.value)
          .subscribe({            
            next: (res) => {    
              this.medicalRecordProfile = res[0];
              console.log("Medical record: ", this.medicalRecordProfile);

              this.medicalRecordProfile.medicalConditions.forEach((condition: IMedicalConditionMedicalRecord) => {
                this.tagsConditions.push({
                  codigo: condition.codigo,
                  designacao: condition.designacao,
                  descricao: condition.descricao,
                  sintomas: condition.sintomas,
                  status: condition.status,
                });
              });
              
  
              this.medicalRecordProfile.allergies.forEach((allergy: IAllergieMedicalRecord) => {
                this.tagsAllergies.push({
                  designacao: allergy.designacao,
                  descricao: allergy.descricao,
                  status: allergy.status,
                });
              });

              this.tagsConditions = this.medicalRecordProfile.medicalConditions;
              this.tagsAllergies = this.medicalRecordProfile.allergies;
              this.descricaoList = this.medicalRecordProfile.descricao;

              this.openModal('ViewMedicalRecord');
            },
            error: (error) => {
              console.error('Error fetching  allergies:', error);
              this.errorMessage = 'Failed to fetch allergies!';
            }
          });



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
      this.sweetService.sweetErro("Nenhuma conta com sessão ativa.")
      this.errorMessage = 'You are not logged in!';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    if (this.selectedStaffId === null) {
      this.sweetService.sweetWarning("Por favor seleciona um membro de Staff.")
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
          this.sweetService.sweetSuccess("Time Slots adicionadas com sucesso.")
          this.getAllstaffsProfiles(); // Refresh the list after creation
        },
        error: (error) => {
          console.error('Error editing staff:', error);
          this.sweetService.sweetErro("Não foi possível adicionar uma ou mais Time Slots.")
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
            this.sweetService.sweetSuccess("Time Slots removidas com sucesso.")

            this.getAllstaffsProfiles(); // Refresh the list after creation
          },
          error: (error) => {
            console.error('Error editing staff:', error);
           this.sweetService.sweetErro("Não foi possível remover uma ou mais Time Slots.")
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
          this.sweetService.sweetSuccess("Perfil Editado com sucesso")
          this.getAllstaffsProfiles(); // Refresh the list after creation
        },
        error: (error) => {
          console.error('Error editing staff:', error);

          this.sweetService.sweetErro("Não foi possível editar o Perfil")

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
    this.getAllSpecializations();
    this.getAllAllergies();
    this.getAllConditions();
    this.setMinDate();
    this.getAllSelectableSpecialization();

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
          this.sweetService.sweetSuccess("Formulário submetido com sucesso")

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
      this.sweetService.sweetErro("Nenhuma conta com sessão ativa.")
      this.errorMessage = 'You are not logged in!';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    if (this.selectOperationTypeId === null) {

      this.sweetService.sweetWarning("Por favor seleciona um Operation Type.");

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
      
      this.sweetService.sweetErro("Nenhuma conta com sessão ativa.")

      this.errorMessage = 'You are not logged in!';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    if (this.selectOperationTypeId === null) {
      
      this.sweetService.sweetWarning("Por favor seleciona uma Operation Type.")
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
          this.sweetService.sweetSuccess("Operation Type atualizado com sucesso!")
          this.getAllOperationTypes(); // Refresh the list after creation
          this.closeModal('UpdateOperationTypeModal');
        },
        error: (error) => {
          console.error('Error editing Operation Type:', error);

          if (error.status === 400) {
            // Erro 400 específico
            this.sweetService.sweetErro("Não podes editar um operation type desativado ou com campos vazios")
          } else {
            // Outros erros
            this.sweetService.sweetErro("Não foi possível atualizar o operation type.")
          }

        },
      });
  }









  removeOperationType(){
    const token = this.authService.getToken();

    if (!token) {

      this.sweetService.sweetErro("Nenhuma conta com sessão ativa.")

      this.errorMessage = 'You are not logged in!';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    if (this.selectOperationTypeId === null) {
      this.sweetService.sweetWarning("Por favor seleciona um Operation Type.")

    } else {

      if (document.getElementById("active_"+this.selectOperationTypeId+"_false")){
        this.sweetService.sweetErro("Operação já está desativada.")
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
          this.sweetService.sweetSuccess("Tipo de operação desativado")

          this.getAllOperationTypes();

        },
        error: (error) => {
          console.error('Error viewing operation type:', error);
          this.errorMessage = 'Failed to view operation type profile!';

          this.sweetService.sweetErro("Não foi possível desativar o tipo de operação");
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
    const formDataA = this.medicalConditionForm.value;
    console.log(formDataA);
    let {codigo, designacao, descricao, sintomas} = this.medicalConditionForm.value;
    sintomas = sintomas.split(',').map((item: string) => item.trim());
    const formData = {codigo,designacao,descricao, sintomas};
    console.log(formData);

    this.medicalConditionService.createMedicalCondition(formData)
    .subscribe({
      next: (response) => {

        this.sweetService.sweetSuccess("Medical condition registered successfully")

        this.modalService.closeModal('insertMedicalCondition');

      },
      error: (error) => {
        console.error('Error fetched:', error);
        this.errorMessage = 'Failed to register a medical condition  !';

        this.sweetService.sweetErro("There is already a medical condition with this name")


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
          this.rejectPolicy();

          this.sweetService.sweetSuccess("Allergie created with success");

          this.modalService.closeModal('insertAllergies');

        },
        error: (error) => {
          this.rejectPolicy(); 

          console.error('Error fetched:', error);
          this.errorMessage = 'Failed to create a allergie  !';

          this.sweetService.sweetErro("Already exist a allergie with this name");
        }
      });

  }

  selectedAllergie: string | null =null;

  getAllAllergies() {
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'You are not logged in!';
      return;
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    this.allergiesService.getAllAllergies()
      .subscribe({
        next: (response) => {
          this.allergiesList = response;
          this.applyFilters();
          console.log("Allergies: ", response);
          console.log("filtered: ", this.filteredAllergies)
        },
        error: (error) => {
          console.error('Error fetching  allergies:', error);
          this.errorMessage = 'Failed to fetch allergies!';
        }
      });

  }

  applyFilters() {
    this.allergiesList = this.allergiesList.filter(allergy => {
      const nameMatch = this.filterAllergy.name
        ? String(allergy.designacao).toLowerCase().includes(String(this.filterAllergy.name).toLowerCase())
        : true;
  
      const descriptionMatch = this.filterAllergy.description
        ? String(allergy.descricao).toLowerCase().includes(String(this.filterAllergy.description).toLowerCase())
        : true;
  
      return nameMatch && descriptionMatch;
    });
  }
  

  selectedAllergieId: string | null = null;

  updateAllergy(){


    const token = this.authService.getToken();

    if (!token) {
      this.sweetService.sweetErro("Nenhuma conta com sessão ativa.")
      this.errorMessage = 'You are not logged in!';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    if (this.selectedAllergie === null) {
      this.sweetService.sweetWarning("Por favor seleciona uma alergia.")
    }else {

      console.log("nome allergy",this.selectedAllergie)

      this.allergiesService.getByDesignacao(this.selectedAllergie)
      .subscribe({
        next: (response) => {
          this.rejectPolicy();

          console.log(response);

          this.allergyUpdate = response;
          this.populateAllergyUpdateForm();

          const updateAllergyData = this.allergyUpdateForm.value;
          console.log('Updated Allergy Data:', updateAllergyData);

          this.openModal('UpdateAllergyModal');

        },
        error: (error) => {
          this.rejectPolicy();

          console.error('Error getting allergy:', error);
          this.errorMessage = 'Failed to getting allergy!';
        }
      });
    }



  }

  populateAllergyUpdateForm(): void {

    this.allergyUpdateForm.patchValue({

        designacao: this.allergyUpdate.props.designacao,
        descricao: this.allergyUpdate.props.descricao


    });

  }


  onUpdateAllergy(){

    const token = this.authService.getToken();

    if (!token) {
      this.errorMessage = 'You are not logged in!';
      return;
    }


    if (!this.selectAllergie) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Nenhum operation type selecionado.',
      });
      return;
    }


    if(this.selectedAllergie)

    this.allergiesService.updateAllergie(this.selectedAllergie,this.allergyUpdateForm.value)
    .subscribe({
        next: (response: any) => {
          this.rejectPolicy();

          this.sweetService.sweetSuccess("Alergia atualizado com sucesso!")
          this.getAllAllergies(); // Refresh the list after creation
          this.closeModal('UpdateAllergyModal');
        },
        error: (error) => {
          this.rejectPolicy();
          console.error('Error editing Allergy:', error);

          if (error.status === 400) {
            // Erro 400 específico
            this.sweetService.sweetErro("Não podes editar um alergia desativado ou com campos vazios")
          } else {
            // Outros erros
            this.sweetService.sweetErro("Não foi possível atualizar a alergia.")
          }

        },
      });

  }

  selectAllergie(id: string ): void{
    this.selectedAllergie = this.selectedAllergie === id ? null : id;
}







onInsertRoomType(){


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


    const formData = this.roomTypeForm.value;

    console.log(formData)

    this.roomTypesService.insertRoomTypes(formData)
      .subscribe({
        next: (response) => {
          this.rejectPolicy();

          this.sweetService.sweetSuccess("Room Type created with success");

          this.modalService.closeModal('insertRoomTypes');

          this.roomTypeForm.reset();

        },
        error: (error) => {
          this.rejectPolicy(); 

          console.error('Error fetched:', error);
          this.errorMessage = 'Failed to create a Room Type  !';

          this.sweetService.sweetErro("Already exist a Room Type with this code");
        }
      });


}













  onSubmitSpecializations() {}
  onSubmitConditions() {}
  onEditMedicalCondition(){
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'You are not logged in!';
      return;
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    if (!this.MedicalConditionSingle) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Nenhum paciente selecionado.',
      });
      return;
    }
    console.log(this.MedicalConditionSingle);
    let {designacao, descricao, sintomas} = this.medicalConditionEditForm.value;
    sintomas = sintomas.split(',').map((item: string) => item.trim());
    const formData = {designacao,descricao, sintomas};

    this.medicalConditionService.updateMedicalCondition(this.MedicalConditionSingle.codigo, formData )
      .subscribe({
        next: (response: any) => {
          this.sweetService.sweetSuccess("Medical Condition Updated Successfully!")
          this.getAllConditions(); // Refresh the list after creation
          this.closeModal('editConditionModal');
        },
        error: (error) => {
          console.error('Error editing medical condition:', error);
          this.sweetService.sweetErro("Could not update medical condition")
          this.errorMessage = 'Failed to edit medical condition!';
          this.successMessage = null;
        }
      });
  }

  getAllSpecializations() {
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

    this.specializationService.getAllSpecializations()
      .subscribe({
        next: (response) => {
          console.log(response);
          this.Specializations = response;
        },
        error: (error) => {
          console.error('Error fetching  profiles:', error);
          this.errorMessage = 'Failed to fetch patients profiles!';
        }
      });
  }


  getAllConditions() {
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

    this.medicalConditionService.getAllMedicalConditions()
      .subscribe({
        next: (response) => {
          console.log(response);
          this.Conditions = response;
        },
        error: (error) => {
          console.error('Error fetching medical conditions:', error);
          this.errorMessage = 'Failed to fetch medical conditions!';
        }
      });
  }


  /*sweetSuccess(text: string){

  Swal.fire({
    icon: "success",
    title: text,
    toast: true,
    position: "top-end",
    timer: 3000,
    showConfirmButton: false
  });

}

sweetWarning(text: string){

  Swal.fire({
    icon: "warning",
    title: text,
    toast: true,
    position: "top-end",
    timer: 3000,
    showConfirmButton: false
  });

}


sweetErro(text: string){

  Swal.fire({
    icon: "error",
    title: text,
    //It was not possible create the allergie
    toast: true,
    position: "top-end",
    timer: 3000,
    showConfirmButton: false
  });

}*/




  viewMedicalCondition(){
    const token = this.authService.getToken();

    if (!token) {
      this.sweetService.sweetErro("Nenhuma conta com sessão ativa.")
      this.errorMessage = 'You are not logged in!';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    if (this.selectConditionId === null) {
      
      this.sweetService.sweetWarning("Please select a Medical Condition.")
    } else {
      console.log(`Viewing medical condition ID: ${this.selectConditionId}`);
     // this.http.get<string>(`${this.staffUrl}/${this.selectedStaffId}`, { headers })
      this.medicalConditionService.viewMedicalCondition(this.selectConditionId)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.MedicalConditionSingle = response;
          console.log(this.MedicalConditionSingle);
          //this.availabilitySlots = this.MedicalConditionSingle.slots;
          this.openModal('viewConditionModal');
        },
        error: (error) => {
          console.error('Error viewing staff:', error);
          this.errorMessage = 'Failed to view staff profiles!';
        }
      });
    }
  }




  editMedicalCondition(){


    const token = this.authService.getToken();

    if (!token) {
      
      this.sweetService.sweetErro("Nenhuma conta com sessão ativa.")
      this.errorMessage = 'You are not logged in!';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    if (this.selectConditionId === null) {
      this.sweetService.sweetWarning("Please select a Medical Condition.")
    } else {
      console.log(`Viewing medical condition ID: ${this.selectConditionId}`);
      this.medicalConditionService.viewMedicalCondition(this.selectConditionId)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.MedicalConditionSingle = response;
          console.log(this.MedicalConditionSingle);
          this.medicalConditionEditForm.get('designacao')?.setValue(this.MedicalConditionSingle.designacao);
          this.medicalConditionEditForm.get('descricao')?.setValue(this.MedicalConditionSingle.descricao);
          this.medicalConditionEditForm.get('sintomas')?.setValue(this.MedicalConditionSingle.sintomas);
          this.openModal('editConditionModal');
        },
        error: (error) => {
          console.error('Error viewing staff:', error);
          this.errorMessage = 'Failed to view staff profiles!';
        }
      });
    }
  }

  editSpecializations(){


    const token = this.authService.getToken();

    if (!token) {
      
      this.sweetService.sweetErro("Nenhuma conta com sessão ativa.")
      this.errorMessage = 'You are not logged in!';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    if (this.selectSpecializationsId === null) {
      this.sweetService.sweetWarning("Please select a Specialization.")
    } else {
      console.log(`Viewing Specialization Name: ${this.selectSpecializationsId}`);
      this.specializationService.viewSpecialization(this.selectSpecializationsId)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.SpecializationSingle = response;
          console.log(this.SpecializationSingle);
          this.specializationEditForm.get('id')?.setValue(this.SpecializationSingle.id);
          this.specializationEditForm.get('SpecializationName')?.setValue(this.SpecializationSingle.specializationName);
          this.specializationEditForm.get('SpecializationDescription')?.setValue(this.SpecializationSingle.specializationDescription);
          this.openModal('editSpecializationModal');
        },
        error: (error) => {
          console.error('Error viewing staff:', error);
          this.errorMessage = 'Failed to view staff profiles!';
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


}
