import { Component, OnInit, AfterViewInit, ElementRef, Input, ViewChild, NgZone} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../../Services/modal.service';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { OperationRequestsService } from '../../../Services/operationRequest.service';
import { AppointmentService } from '../../../Services/appointment.service';
import { SurgeryRoomsService } from '../../../Services/surgeryRoom.service';
import { AllergiesService } from '../../../Services/allergies.service';
import { MedicalConditionService } from '../../../Services/medicalCondition.service';
import { PatientService } from '../../../Services/patient.service';
import { StaffService } from '../../../Services/staff.service';
import * as THREE from "three";
import { MedicalRecordService } from '../../../Services/medicalRecordservice';
import { forkJoin } from 'rxjs';
//@ts-ignore
import Orientation from './map/orientation';
//@ts-ignore
import ThumbRaiser from './map/hospital';
import { sweetAlertService } from '../../../Services/sweetAlert.service';

interface CreatingOperationRequestUIDto {
  patientEmail: string;
  operationTypeName: string;
  deadline: string;
  priority: string;
}

interface OperationRequest {
  id: string;
  operationTypeName: string;
  emailDoctor: string;
  emailPatient: string;
  deadline: string;
  priority: string;
}

interface SurgeryRoomUIDto {
  Id: string;
  RoomNumber: string;
  Type: string;
}

interface StaffUIDto {
  Id: string;
  LicenseNumber: string;
  Role: string;
  Specialization: string;
}


interface UpdateOperationRequestDto {
  id: string;
  deadline?: string;
  priority?: string;
}

interface CreatingAppointmentDto {
  roomId: string;
  operationRequestId: string;
  start: string;
  selectedStaff: string[]; 
}

interface MedicalRecordRequest {
  id: string;
  date: Date;
  staff: string;
  patientEmail: string;
  allergies: IAllergieMedicalRecord[];
  medicalConditions: IMedicalConditionMedicalRecord[];
  descricao: string
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

interface CreatingMedicalRecordUIDto {
  staff: string;
  patientId: string;
  allergies: IAllergieMedicalRecord[];
  medicalConditions: IMedicalConditionMedicalRecord[];
  descricao?: string
}

export enum AllergyStatus {
  Active = 'Active',
  NotMeaningfulAnymore = 'Not Meaningful Anymore',
  Misdiagnosed = 'Misdiagnosed'
}




@Component({
  selector: 'app-operation-request',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent implements OnInit {
  @ViewChild('myCanvas') private canvasRef!: ElementRef
  thumbRaiser: any;


  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  initialize() {
    // Initialize the game with necessary parameters
    /*this.thumbRaiser = new ThumbRaiser(
      {}, // General Parameters
      {scale: new THREE.Vector3(1.0, 0.5, 1.0)}, // Maze parameters
      {}, // Player parameters
      {
        ambientLight: { intensity: 0.1 },
        pointLight1: { intensity: 50.0, distance: 20.0, position: new THREE.Vector3(-3.5, 10.0, 2.5) },
        pointLight2: { intensity: 50.0, distance: 20.0, position: new THREE.Vector3(3.5, 10.0, -2.5) }
      }, // Lights parameters
      {}, // Fog parameters
      { view: "fixed", multipleViewsViewport: new THREE.Vector4(0.0, 1.0, 0.45, 0.5) }, // Fixed view camera parameters
      { view: "first-person", multipleViewsViewport: new THREE.Vector4(1.0, 1.0, 0.55, 0.5), initialOrientation: new Orientation(0.0, -10.0), initialDistance: 2.0, distanceMin: 1.0, distanceMax: 4.0 }, // First-person view camera parameters
      { view: "third-person", multipleViewsViewport: new THREE.Vector4(0.0, 0.0, 0.55, 0.5), initialOrientation: new Orientation(0.0, -20.0), initialDistance: 2.0, distanceMin: 1.0, distanceMax: 4.0 }, // Third-person view camera parameters
      { view: "top", multipleViewsViewport: new THREE.Vector4(1.0, 0.0, 0.45, 0.5), initialOrientation: new Orientation(0.0, -90.0), initialDistance: 4.0, distanceMin: 1.0, distanceMax: 16.0 }, // Top view camera parameters
      { view: "mini-map", multipleViewsViewport: new THREE.Vector4(0.99, 0.02, 0.3, 0.3), initialOrientation: new Orientation(180.0, -90.0), initialZoom: 0.64 } // Mini-map view camera parameters
    );*/
  }

  /*animate() {
    requestAnimationFrame(() => this.animate());
    // Update the game (call update method of thumbRaiser)
    this.thumbRaiser.update();
  }

  ngAfterViewInit(): void {
    this.initialize();
    this.animate();


    const canvas  = document.querySelectorAll('canvas')[2];
    const targetDiv = document.getElementById('canvasContainer');
    if (targetDiv) {
        targetDiv.appendChild(canvas);
    } else {
      console.error('Target div not found.');

    }
  }*/



  operationRequest: CreatingOperationRequestUIDto = {
    patientEmail: '',
    operationTypeName: '',
    deadline: '',
    priority: ''
  };

  updateRequest: UpdateOperationRequestDto = {
    id: '',
    deadline: '',
    priority: ''
  };

  operationRequests: OperationRequest[] = [];

  notscheduledOperationRequests: OperationRequest[] = [];

  filteredRequests: OperationRequest[] = [];
  filter = {
    priority: '',
    operationTypeName: '',
    emailPatient: '',
    emailDoctor: ''
  };

  surgeryRooms: SurgeryRoomUIDto[] = [];

  staffs: StaffUIDto[] = [];

  medicalRecordRequests: MedicalRecordRequest[] = [];
  medicalRecordPatientEmail: string = '';
  filteredMedicalRecordRequests: MedicalRecordRequest[] = [];
  filterMedicalRecord = {
    date: '',
    staff: '',
    patientEmail: '',
    allergies: '',
    medicalConditions: '',
    descricao: ''
  };


  medicalRecordRequest: CreatingMedicalRecordUIDto ={
    staff: '',
    patientId: '',
    allergies: [],
    medicalConditions: [],
    descricao: ''
  }

  appointmentData = {
    date: { start: ''},
    selectedStaff: ['']
  };

  selectedOperationRequestId: string | null = null;

  selectedSurgeryRoomId: string | null = null;



  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private http: HttpClient,
    private authService: AuthService,
    private operationRequestsService: OperationRequestsService,
    private appointmentService: AppointmentService,
    private surgeryRoomService: SurgeryRoomsService,
    private allergiesService: AllergiesService,
    private medicalConditionService: MedicalConditionService,
    private medicalRecordService: MedicalRecordService,
    private patientService : PatientService,
    private staffService : StaffService,
    private sweetService : sweetAlertService,
    private router: Router,
    private ngZone: NgZone
  ) {

    this.medicalRecordUpdate = this.fb.group({
      patientId: "",
      descricao: ['', Validators.required],
      //agree: [false, Validators.requiredTrue],
      medicalConditions: this.fb.array([]),
      allergies: this.fb.array([])
    });
  }

  medicalRecordUpdate!: FormGroup;
  medicalRecordProfileUpdate: any = null;

  isPolicyAccepted = false; 
  showPolicyModal = false; 

  ngOnInit() {
    this.getAllOperationRequests();
    this.getAllMedicalRecords();
    this.getAllAllergies();
    this.getAllMedicalConditions();
    this.getAllSurgeryRooms();
    this.getAllStaffs();
    this.getAllNotScheduledOperationRequests();
  }


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getAllSurgeryRooms() {
    const token = this.authService.getToken();
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'You are not logged in!',
      });
      return;
    }

    this.surgeryRoomService.getAllSurgeryRooms().subscribe({
      next: (response: SurgeryRoomUIDto[]) => {
        this.surgeryRooms = response;
      },
      error: (error) => {
        console.error('Error fetching rooms:', error);
      }
    });
  }

  getAllStaffs() {
    const token = this.authService.getToken();
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'You are not logged in!',
      });
      return;
    }

    this.staffService.getAllUIStaffs().subscribe({
      next: (response: StaffUIDto[]) => {
        this.staffs = response;
      },
      error: (error) => {
        console.error('Error fetching staffs:', error);
      }
    });
  }

  getAllOperationRequests() {
    const token = this.authService.getToken();
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'You are not logged in!',
      });
      return;
    }

    this.operationRequestsService.getAllOperationRequests().subscribe({
      next: (response: OperationRequest[]) => {
        this.operationRequests = response;
        this.applyFilter();
      },
      error: (error) => {
        console.error('Error fetching requests:', error);
      }
    });
  }

  getAllNotScheduledOperationRequests() {
    const token = this.authService.getToken();
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'You are not logged in!',
      });
      return;
    }

    this.operationRequestsService.getAllNotScheduledOperationRequests().subscribe({
      next: (response: OperationRequest[]) => {
        this.notscheduledOperationRequests = response;
      },
      error: (error) => {
        console.error('Error fetching requests:', error);
      }
    });
  }


  applyFilter() {
    this.filteredRequests = this.operationRequests.filter(request => {
      const matchesPriority = this.filter.priority
        ? request.priority.toLowerCase() === this.filter.priority.toLowerCase()
        : true;

      const matchesOperationType = this.filter.operationTypeName
        ? request.operationTypeName.toLowerCase().includes(this.filter.operationTypeName.toLowerCase())
        : true;

      const matchesEmailPatient = this.filter.emailPatient
        ? request.emailPatient.toLowerCase().includes(this.filter.emailPatient.toLowerCase())
        : true;

      const matchesEmailDoctor = this.filter.emailDoctor
        ? request.emailDoctor.toLowerCase().includes(this.filter.emailDoctor.toLowerCase())
        : true;

      return matchesPriority && matchesOperationType && matchesEmailPatient && matchesEmailDoctor;
    });
  }

  allergiesList: any[] = [];
  allergiesListStatus: string[] = ['Active', 'Not Meaningful Anymore', 'Misdiagnosed'];
  filteredAllergieStatusOptions: string[] = [...this.allergiesListStatus];
  medicalConditionsList: any[] = [];
  //medicalRecordList: any[] = [];
  newMedicalCondition: string = '';
  newAllergy: string = '';
  filteredOptions: any[] = [];

  selectedAllergieId: string | null = null;
  errorMessage: string | null = null;
  filterText: string = '';
  tags: string[] = [];

  filterAllergieNameText: string = '';
  filterAllergieDescricaoText: string = '';
  filterConditionDescricaoText: string = '';
  filterAllergieStatusText: string = '';
  filterConditionStatusText: string = '';
  filterTextCondition: string = '';
  sintomasCodition: string = '';
  filterConditionCodigoText: string = '';
  tagsAllergies: IAllergieMedicalRecord[] = [];
  tagsConditions: IMedicalConditionMedicalRecord[] = [];
  filteredAllergieNameOptions: any[] = [];
  filteredOptionsConditions: any[] = [];

  showDropdown: boolean = false;
  showDropdown2: boolean = false;
  showDropdown3: boolean = false;
  showDropdown4: boolean = false;

  selectedAllergie: string | null =null;
  selectedPatientEmailMedicalRecord: string | null =null;
  selectedPatientIdMedicalRecord: string | null =null;
  successMessage: string | null = null;


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





  selectAllergie(id: string){
      this.selectedAllergie = this.selectedAllergie === id ? null : id;
  }

  selectMedicalRecord(email: string){
    this.selectedPatientEmailMedicalRecord = this.selectedPatientEmailMedicalRecord === email ? null :email;
}



  selectPatient(id: string){}
  getAllAllergies() {
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'You are not logged in!';
      return;
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    //this.http.get<any[]>(`${this.patientUrl}/search`, { headers, params })
    this.allergiesService.getAllAllergies()
      .subscribe({
        next: (response) => {
          this.allergiesList = response;
          console.log("teste: ", response);
        },
        error: (error) => {
          console.error('Error fetching  allergies:', error);
          this.errorMessage = 'Failed to fetch allergies!';
        }
      });
  }

  getAllMedicalConditions() {
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'You are not logged in!';
      return;
    }

    this.medicalConditionService.getAllMedicalConditions()
      .subscribe({
        next: (response) => {
          this.medicalConditionsList = response;
          console.log("teste: ", response);
        },
        error: (error) => {
          console.error('Error fetching  medical conditions:', error);
          this.errorMessage = 'Failed to fetch medical conditions!';
        }
      });
  }


  filterOptions(): void {
    const filterValue = this.filterText.toLowerCase();
    this.filteredOptions = this.allergiesList.filter(option =>
      option.designacao.toLowerCase().includes(filterValue),

    );
  }


  filterAllergieNameOptions(): void {
    const filterValue = this.filterAllergieNameText.toLowerCase();
    this.filteredAllergieNameOptions = this.allergiesList.filter(option =>
      option.designacao.toLowerCase().includes(filterValue),
    );
  }

  filterAllergieStatusOptions(): void {
    const filterValue = this.filterAllergieStatusText.toLowerCase();
    this.filteredAllergieStatusOptions = this.allergiesListStatus.filter(option =>
      option.toLowerCase().includes(filterValue),
    );

  }

  filterConditionStatusOptions(): void {
    const filterValue = this.filterConditionStatusText.toLowerCase();
    this.filteredAllergieStatusOptions = this.allergiesListStatus.filter(option =>
      option.toLowerCase().includes(filterValue),
    );

  }

  filterOptionsMedicalConditions(): void {
    const filterValueCondition = this.filterTextCondition.toLowerCase();
    this.filteredOptionsConditions = this.medicalConditionsList.filter(option =>
      option.designacao.toLowerCase().includes(filterValueCondition),
    );
  }

  selectOption(option: string): void {
    this.filterText = option;
    this.showDropdown = false;
  }

  selectOptionTagAllergies(designacao: string) {
    this.filterAllergieNameText = designacao;
    this.filterAllergieDescricaoText = this.allergiesList.find(option =>
      option.designacao.toLowerCase() === designacao.toLowerCase()
    ).descricao;

    this.showDropdown2 = false;
  }

  selectOptionTagStatusAllergies(designacao: string) {
    this.filterAllergieStatusText = designacao;
    this.showDropdown3 = false;
  }

  selectOptionTagStatusCondition(designacao: string) {
    this.filterConditionStatusText = designacao;
    this.showDropdown4 = false;
  }

  toggleDropdown(): void {
    this.showDropdown2 = !this.showDropdown2;
    if (this.showDropdown2) {
      this.filteredAllergieStatusOptions = [...this.allergiesListStatus];
    }
  }

  selectOptionMedicalCondition(designacao: string) {
    this.filterTextCondition = designacao;

    this.filterConditionDescricaoText = this.medicalConditionsList.find(option =>
      option.designacao.toLowerCase() === designacao.toLowerCase()
    ).descricao;

    this.filterConditionCodigoText = this.medicalConditionsList.find(option =>
      option.designacao.toLowerCase() === designacao.toLowerCase()
    ).codigo;

    this.showDropdown2 = false;
  }

  addAllergie() {

    let allergieAdd: IAllergieMedicalRecord = {
      designacao: this.filterAllergieNameText,
      descricao: this.filterAllergieDescricaoText,
      status: this.filterAllergieStatusText,
    };

    let exist = this.tagsAllergies.find(option =>
      option.designacao.toLowerCase() === this.filterAllergieNameText.toLowerCase()
    );

    if(!exist){
      this.tagsAllergies.push(allergieAdd);
      console.log(this.tagsAllergies);
    }

  }


  addMedicalCondition() {
    let medicalConditionAdd: IMedicalConditionMedicalRecord = {
      codigo: this.filterConditionCodigoText,
      designacao: this.filterTextCondition,
      descricao: this.filterConditionDescricaoText,
      status: this.filterConditionStatusText,
      sintomas:  this.sintomasCodition.split(',').map((item: string) => item.trim()),
    };

    let exist = this.tagsConditions.find(option =>
      option.designacao.toLowerCase() === this.filterTextCondition.toLowerCase()
    );

    if(!exist){
      this.tagsConditions.push(medicalConditionAdd);
      console.log("update array: ",  this.tagsConditions);
    }

    
  }

  removeMedicalCondition(index: number) {
      this.tagsConditions.splice(index, 1);
  }

  removeAllergie(index: number) {
    this.tagsAllergies.splice(index, 1);
}




  hideDropdown(): void {
    // Pequeno atraso para evitar esconder antes de selecionar
    setTimeout(() => this.showDropdown = false, 200);

  }


  onFilterRequests() {
    this.getAllOperationRequests();
    this.applyFilter();
    this.closeModal('filterRequestModal');
  }

  /*onFilterMedicalRecordRequests() {
    this.getAllMedicalRecords();
    this.applyMedicalRecordFilter();
    this.closeModal('filterMedicalRecordRequestModal');
  }*/

  onCreateAppointment() {
    const token = this.authService.getToken();
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'You are not logged in!',
      });
      return;
    }
  
    if (!this.selectedOperationRequestId) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Operation Request',
        text: 'Please select an operation request!',
      });
      return;
    }
  
    if (!this.selectedSurgeryRoomId) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Surgery Room',
        text: 'Please select a surgery room!',
      });
      return;
    }
  
    if (this.appointmentData.selectedStaff.length === 0 || this.appointmentData.selectedStaff.some(staffId => !staffId)) {
      Swal.fire({
        icon: 'error',
        title: 'Incomplete Staff Selection',
        text: 'Please select at least one staff member!',
      });
      return;
    }
  
    const payload: CreatingAppointmentDto = {
      roomId: this.selectedSurgeryRoomId,
      operationRequestId: this.selectedOperationRequestId,  
      start: this.appointmentData.date.start,
      selectedStaff: this.appointmentData.selectedStaff
    };
    
    this.appointmentService.createAppointments(payload).subscribe({
      next: () => {
        // this.getAllAppointments();
        this.cleanRegister();
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Appointment created successfully!',
          showConfirmButton: false,
          timer: 1500,
        });
        this.modalService.closeModal('createAppointmentModal');
      },
      error: (error) => {
        console.error('Error creating appointment:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to create appointment.',
        });
      },
    });
  }


addStaffMember() {
  this.appointmentData.selectedStaff.push('');
}


removeStaffMember(index: number) {
  if (this.appointmentData.selectedStaff.length > 1) {
    this.appointmentData.selectedStaff.splice(index, 1);
  }
}

  onCreateRequest(requestData: CreatingOperationRequestUIDto) {
    const token = this.authService.getToken();
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'You are not logged in!',
      });
      return;
    }

    const payload: CreatingOperationRequestUIDto = {
      patientEmail: requestData.patientEmail,
      operationTypeName: requestData.operationTypeName,
      deadline: requestData.deadline,
      priority: requestData.priority
    };

    this.operationRequestsService.createOperationRequests(payload).subscribe({
      next: () => {
        this.getAllOperationRequests();
        this.cleanRegister();
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Operation request created successfully!',
          showConfirmButton: false,
          timer: 1500
        });
        this.modalService.closeModal('createRequestModal');
      },
      error: (error) => {
        console.error('Error creating operation request:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to create operation request.',
        });
      }
    });
  }

  onUpdateRequest(requestData: UpdateOperationRequestDto) {
    if (!requestData.id) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Invalid operation request ID!',
      });
      return;
    }

    const token = this.authService.getToken();
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'You are not logged in!',
      });
      return;
    }

    const payload: UpdateOperationRequestDto = {
      id: requestData.id,
      deadline: requestData.deadline,
      priority: requestData.priority
    };

    this.operationRequestsService.updateOperationRequests(payload).subscribe({
      next: () => {
        this.getAllOperationRequests();

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Operation request updated successfully!',
          showConfirmButton: false,
          timer: 1500
        });

        this.modalService.closeModal('updateRequestModal');
      },
      error: (error) => {
        console.error('Error updating operation request:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update operation request.',
        });
      }
    });
  }

  setUpdateRequest(request: OperationRequest) {
    this.updateRequest.id = request.id;
    this.updateRequest.deadline = request.deadline;
    this.updateRequest.priority = request.priority;
    this.openModal('updateRequestModal');
  }

  onDeleteRequest(id: string) {
    const token = this.authService.getToken();
    if (!token) {
      alert('You are not logged in!');
      return;
    }


    this.operationRequestsService.deleteOperationRequests(id).subscribe({
      next: () => {
        this.getAllOperationRequests();

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Operation request deleted successfully!',
          showConfirmButton: false,
          timer: 1500
        });

        this.modalService.closeModal('deleteModal');
      },
      error: (error) => {
        console.error('Error deleting operation request:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete operation request.',
        });
      }
    });
  }

  async onCreateMedicalRecord(requestData: CreatingMedicalRecordUIDto) {
    

    const token = this.authService.getToken();
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'You are not logged in!',
      });
      return;
    }

    const staffEmail = this.authService.getEmail();


    if (!this.isPolicyAccepted) {
      alert('You must accept the policy to submit the form.');
      return;
    }


    forkJoin({
      patient: this.patientService.getPatientByEmail(requestData.patientId),
      staff: this.staffService.getStaffByEmail(staffEmail),
    }).subscribe({
      next: ({ patient, staff }) => {
       
        const getPatientId = patient.id.value;
        const staffId = staff.id;

        const payload: CreatingMedicalRecordUIDto = {
          staff: staffId,
          patientId: getPatientId,
          allergies: this.tagsAllergies,
          medicalConditions: this.tagsConditions.map((condition) => ({
            ...condition,
            sintomas: condition.sintomas.filter((sintoma: string) => sintoma.trim() !== ''), 
          })),
          descricao: requestData.descricao || "",
        };

       
        console.log("Medical record payload:", payload);


        this.medicalRecordService.createMedicalRecord(payload).subscribe({
          next: () => {
            this.cleanMedicalRecordRegister();
            this.getAllMedicalRecords();
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Medical Record created successfully!',
              showConfirmButton: false,
              timer: 1500,
            });
            this.modalService.closeModal('registerMedicalRecordModal');

            this.rejectPolicy();
          },
          error: (error: any) => {
            this.rejectPolicy();

            console.error('Error creating Medical Record:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to create Medical Record.',
            });
          },
        });
      },
      error: (error: any) => {
        this.rejectPolicy();

        console.error('Error fetching patient or staff:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch patient or staff information.',
        });
      },
    });
  }


  selectOptionTag(option: string) {
    if (!this.tags.includes(option)) {
      this.tags.push(option);
    }
    this.filterText = '';
    this.showDropdown = false;
  }





  addTagFromInput(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.filterText.trim()) {
      const newTag = this.filterText.trim();
      if (!this.tags.includes(newTag)) {
        this.tags.push(newTag);
      }
      this.filterText = '';
      this.showDropdown = false;
    }
  }



  removeTag(index: number) {
    this.tags.splice(index, 1);
    this.filterText = '';
  }


  onBlur() {
    setTimeout(() => (this.showDropdown = false), 200);
    setTimeout(() => (this.showDropdown2 = false), 200);
    setTimeout(() => (this.showDropdown3 = false), 200);
    setTimeout(() => (this.showDropdown4 = false), 200);
  }


 /* addMedicalCondition() {
    if (this.newMedicalCondition.trim() && !this.medicalRecordRequest.medicalConditions.includes(this.newMedicalCondition.trim())) {
      this.medicalRecordRequest.medicalConditions.push(this.newMedicalCondition.trim());
      this.newMedicalCondition = ''; // Limpa o campo de entrada
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: 'Condição médica já adicionada ou inválida!',
      });
    }
  }*/



  getAllMedicalRecords() {
    const token = this.authService.getToken();
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'You are not logged in!',
      });
      return;
    }

    this.medicalRecordService.getAllMedicalRecord()
    .subscribe({
      next: async (response) => {
        this.medicalRecordRequests = response;


        this.medicalRecordRequests.forEach(async element => {
           this.patientService.getPatientEmailById(element.patientEmail).subscribe({
            next: (res) => {
              element.patientEmail =  res[0].email.fullEmail;
            },
          });

          this.staffService.getStaff(element.staff).subscribe({
            next: (res) => {
              element.staff =  res[0].email.fullEmail;
            },
          });

        });

      },
      error: (error) => {
        console.error('Error fetching requests:', error);
      }
    });
  }

  applyMedicalRecordFilter() {
    this.filteredMedicalRecordRequests = this.medicalRecordRequests.filter(request => {
      const matchesAllergie = this.filterMedicalRecord.allergies
      ? (request.allergies as IAllergieMedicalRecord[]).some(allergie =>
          allergie.designacao.toLowerCase().includes(this.filterMedicalRecord.allergies.toLowerCase())
        )
      : true;

      const matchesMedicalCondition = this.filterMedicalRecord.medicalConditions
      ? (request.medicalConditions as IMedicalConditionMedicalRecord[]).some(medicalCondition =>
        medicalCondition.designacao.toLowerCase().includes(this.filterMedicalRecord.medicalConditions.toLowerCase())
        )
      : true;

      return matchesAllergie && matchesMedicalCondition;
    });
  }

  editMedicalRecord() {
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

    if (this.selectedPatientEmailMedicalRecord === null) {
      Swal.fire({
        icon: "warning",
        title: "Please select a medical record.",
        toast: true,
        position: "bottom-right",
        timer: 3000,
        showConfirmButton: false
      });
    } else {
      console.log(`Viewing Patient Id medical record: ${this.selectedPatientEmailMedicalRecord}`);

      this.medicalRecordService.getAllMedicalRecordByPatientId(this.selectedPatientEmailMedicalRecord)
        .subscribe({
          next: (response) => {
            this.medicalRecordProfileUpdate = response[0];
            console.log("Medical record: ", this.medicalRecordProfileUpdate);

            // Patch form data
            this.medicalRecordUpdate.patchValue({
              patientId: this.medicalRecordProfileUpdate.patientEmail,
              descricao: this.medicalRecordProfileUpdate.descricao
            });

            const medicalConditionsControl = this.medicalRecordUpdate.get('medicalConditions') as FormArray;
            const allergiesControl = this.medicalRecordUpdate.get('allergies') as FormArray;
            
            // Clear existing items (if needed)
            medicalConditionsControl.clear();
            allergiesControl.clear();
            
            // Add existing conditions to the form
            this.medicalRecordProfileUpdate.medicalConditions.forEach((condition: IMedicalConditionMedicalRecord) => {
              medicalConditionsControl.push(this.fb.group({
                codigo: [condition.codigo],
                designacao: [condition.designacao],
                descricao: [condition.descricao],
                sintomas: this.fb.array(condition.sintomas || []),
                status: [condition.status],
              }));
            });
            
            // Add existing allergies to the form
            this.medicalRecordProfileUpdate.allergies.forEach((allergy: IAllergieMedicalRecord) => {
              allergiesControl.push(this.fb.group({
                designacao: [allergy.designacao],
                descricao: [allergy.descricao],
                status: [allergy.status],
              }));
            });
            
            this.tagsConditions = this.medicalRecordProfileUpdate.medicalConditions;
            this.tagsAllergies = this.medicalRecordProfileUpdate.allergies;
            
            const updatedMedicalRecordData = this.medicalRecordUpdate.value;
            console.log('Updated Patient Data:', updatedMedicalRecordData);
            console.log('Updated allergies:', this.tagsAllergies);

            this.openModal('UpdateMedicalRecordModal');
          },
          error: (error) => {
            console.error('Error getting medical record:', error);
            this.errorMessage = 'Failed to get medical record!';
          }
        });
    }
  }


  deleteMedicalRecord(){
     console.log(`Deactivating medical record ID: ${this.selectedPatientEmailMedicalRecord}`);
            
      if (!this.selectedPatientEmailMedicalRecord) {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'No medical record selected.',
        });
        return;
      }

      forkJoin({
      patient: this.patientService.getPatientByEmail(this.selectedPatientEmailMedicalRecord)
    }).subscribe({
      next: ({ patient }) => {
        console.log(patient);
     
      console.log(patient.id.value);
      this.selectedPatientIdMedicalRecord = patient.id.value;

      this.medicalRecordService.deleteMedicalRecord(this.selectedPatientIdMedicalRecord)
      .subscribe({
        next: (response) => {
          this.getAllMedicalConditions();
          this.sweetService.sweetSuccess("Medical Record desativado com sucesso")
        },
        error: (error) => {
          console.error('Error deactivating medical record:', error);
          this.errorMessage = 'Failed to deactivate medical record!';
          this.sweetService.sweetErro("Failed to deactivate medical record")
        }
      });

    }});

    };   



  onUpdateMedicalRecord() {
    const token = this.authService.getToken();

    if (!token) {
      this.errorMessage = 'You are not logged in!';
      return;
    }

    if (!this.selectedPatientEmailMedicalRecord) {
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Nenhum medical record selecionado.',
      });
      return;
    }

    

    const updatedPatientData = this.medicalRecordUpdate.value;


  // Remover `_id` de allergies e medicalConditions
  updatedPatientData.allergies = this.tagsAllergies.map(({ _id, ...rest }) => rest);
  updatedPatientData.medicalConditions = this.tagsConditions.map(({ _id, ...rest }) => {
    return {
      ...rest,
      sintomas: rest.sintomas.filter((sintoma: string) => sintoma.trim() !== ''), 
    };
  });


    console.log("to be updated:" ,  updatedPatientData);

    this.medicalRecordService.updateMedicalRecord(updatedPatientData)
      .subscribe({
        next: (response: any) => {
          console.log("Updated medical record response: ", response);
          this.sweetService.sweetSuccess("Medical record edited successfully");

          this.getAllMedicalRecords();
          this.cleanMedicalRecordRegister();
          this.closeModal('UpdateMedicalRecordModal');

          this.rejectPolicy();
        },
        error: (error) => {
          this.rejectPolicy();
          
          console.error('Error editing Medical Record:', error);          
          this.sweetService.sweetErro("Error editing Medical Record");
          
          this.errorMessage = 'Failed to edit Medical Record!';
          this.successMessage = null;
        }
      });
  }




  openModal(modalId: string): void {
    this.modalService.openModal(modalId);
  }

  closeModal(modalId: string): void {
    this.modalService.closeModal(modalId);
  }

  isModalOpen(modalId: string): boolean {
    return this.modalService.isModalOpen(modalId);
  }

  cleanRegister() {
    this.operationRequest = {
      patientEmail: '',
      operationTypeName: '',
      deadline: '',
      priority: ''
    };
  }

  cleanAppointmentModal() {
    this.appointmentData = {
      date: { start: ''},
      selectedStaff: ['']
    };
    this.selectedOperationRequestId = null;
    this.selectedSurgeryRoomId = null;
  }

  cleanMedicalRecordRegister() {
    this.tagsAllergies = [];
    this.filterText = '';
    this.tagsConditions = [];
    this.filterTextCondition = '';

    this.filterAllergieNameText = '';
    this.filterAllergieDescricaoText = '';
    this.filterAllergieStatusText = '';

    this.filterConditionCodigoText = '';
    this.filterTextCondition = '';
    this.filterConditionDescricaoText = '';
    this.filterConditionStatusText = '';
    this.sintomasCodition = '';

    this.medicalRecordRequest = {
      staff: '',
      patientId: '',
      allergies: [],
      medicalConditions: [],
      descricao: ''
    };
  }
}
