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
import { firstValueFrom, forkJoin } from 'rxjs';
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

interface AppointmentUIDto {
  id: string;
  roomNumber: string;
  date: SlotDto;
}

interface SlotDto {
  startTime: string;
  endTime: string;
}

interface updateAppointmentDto {
  id: string;
  roomId: string;
  start: string;
  selectedStaff: string[];
}

interface SurgeryRoomUIDto {
  id: string;
  roomNumber: string;
  type: string;
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
  descricao: string[]
}


interface IAllergieMedicalRecord {
  designacao: string;
  descricao: string;
  status: string;
  _id?: string;
  note: string;
}

export interface IMedicalConditionMedicalRecord {
  codigo: string;
  designacao: string;
  descricao: string;
  sintomas: string[];
  status: string;
  _id?: string;
  note: string;
}

interface CreatingMedicalRecordUIDto {
  staff: string;
  patientId: string;
  allergies: IAllergieMedicalRecord[];
  medicalConditions: IMedicalConditionMedicalRecord[];
  descricao: string[]
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
    this.thumbRaiser = new ThumbRaiser(
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
    );
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    // Update the game (call update method of thumbRaiser)
    this.thumbRaiser.update();
  }

  ngAfterViewInit(): void {
    this.initialize();
    this.animate();
    const canvas  = document.querySelectorAll('canvas');
    const targetDiv = document.getElementById('canvasContainer');
    canvas.forEach(element => {
      //element.style.pointerEvents = 'none';
      //element.style.zIndex = '1';
      if (targetDiv) {
        targetDiv.appendChild(element);
      } 
    });
  }



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

  updateAppointment: updateAppointmentDto = {
    id: '',
    roomId: '',
    start: '',
    selectedStaff: []
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

  appointments: AppointmentUIDto[] = [];

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
    descricao: []
  }

  appointmentData = {
    date: { start: ''},
    selectedStaff: ['']
  };

  selectedOperationRequestId: string | null = null;

  selectedSurgeryRoomId: string | null = null;
  validConditionText: string = '✘';
  validAllergieText: string = '✘';


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
      descricao: this.fb.array([]),
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
    this.getAllAppointments();
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
  doTheClick(){
    let a = this.thumbRaiser.CurrentRoom;
    console.log(a);
    if(a != 0 && a!= null) {
      this.thumbRaiser.fetchRoomData(a - 1).then((roomData: string) => {
      console.log("Room " + roomData);
      }).catch((error: any) => {
          console.error("Failed to fetch room data:", error);
      });
    }
    else {
      console.log("Lobby");
    }
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

  getAllAppointments() {
    const token = this.authService.getToken();
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'You are not logged in!',
      });
      return;
    }

    this.appointmentService.getAllAppointments().subscribe({
      next: (response: AppointmentUIDto[]) => {
        this.appointments = response;
      },
      error: (error) => {
        console.error('Error fetching appointments:', error);
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
  noteAllergie: string = '';

  filterConditionStatusText: string = '';
  filterTextCondition: string = '';
  filterTextDescription: string = '';
  sintomasCodition: string = '';
  filterConditionCodigoText: string = '';
  noteCondition: string = '';

  tagsAllergies: IAllergieMedicalRecord[] = [];
  tagsConditions: IMedicalConditionMedicalRecord[] = [];
  descricaoList : string[] = [];
  filteredAllergieNameOptions: any[] = [];
  filteredOptionsConditions: any[] = [];

  filteredTagsAllergies =[...this.tagsAllergies];
  allergieNameFilter: string = '';
  allergieDescriptionFilter:string = '';
  allergieStatusFilter:string = '';
  allergieNoteFilter:string = '';
  filteredTagsConditions =[...this.tagsConditions];
  medicalConditionNameFilter: string = '';
  medicalConditionCodeFilter: string = '';
  medicalConditionDescriptionFilter: string = '';
  medicalConditionStatusFilter: string = '';
  medicalConditionSymptomsFilter: string = '';
  medicalConditionNoteFilter: string = '';

  staffEmailSelectedMedicalRecord: string = '';

  

  showDropdown: boolean = false;
  showDropdown2: boolean = false;
  showDropdown3: boolean = false;
  showDropdown4: boolean = false;

  selectedAllergie: string | null =null;
  selectedPatientEmailMedicalRecord: string | null =null;
  selectedPatientIdMedicalRecord: string | null =null;
  successMessage: string | null = null;

  updateConditionToValid(): void {
      this.validConditionText = '✔';
  }
  isConditionValid(): boolean {
    return this.validConditionText === '✔' && this.filterConditionStatusText != '';
}
  updateConditionToInvalid(): void {
      this.validConditionText = '✘';
  }


  updateAllergieToValid(): void {
    this.validAllergieText = '✔';
}
isAllergieValid(): boolean {
  return this.validAllergieText === '✔' && this.filterAllergieStatusText != '';
}
updateAllergieToInvalid(): void {
    this.validAllergieText = '✘';
}
  filteredAllergies = [...this.tagsAllergies];
  filteredConditions = [...this.tagsConditions];
  filteredDescriptions = [...this.descricaoList];

  medicalRecordProfile: any = null;


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
          this.filterOptionsMedicalConditions();
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
    this.updateAllergieToInvalid();

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
    this.updateConditionToInvalid();
    this.filterConditionDescricaoText = "";
    this.filterConditionCodigoText = "";

    const filterValueCondition = this.filterTextCondition
        .toLowerCase()
        .split(' ')
        .filter(word => word.trim() !== '');

    this.filteredOptionsConditions = this.medicalConditionsList.filter(option => {
        const combinedString = `[${option.codigo}] ${option.designacao}`.toLowerCase();
        return filterValueCondition.every(word => combinedString.includes(word));
    });
}

  selectOption(option: string): void {
    this.filterText = option;
    this.showDropdown = false;
  }

  selectOptionTagAllergies(designacao: string) {
    this.updateAllergieToValid();

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
    this.updateConditionToValid();
    this.filterTextCondition = designacao;

    this.filterConditionDescricaoText = this.medicalConditionsList.find(option =>
      option.designacao.toLowerCase() === designacao.toLowerCase()
    ).descricao;

    this.filterConditionCodigoText = this.medicalConditionsList.find(option =>
      option.designacao.toLowerCase() === designacao.toLowerCase()
    ).codigo;

    this.showDropdown2 = false;
  }

  isDoctor: boolean = false;

  async isDoctorAuthorized() {
  
    try {
      const res = await firstValueFrom(this.staffService.viewStaff(this.staffEmailSelectedMedicalRecord));
      const staffEmail = res.email.fullEmail;
    
      if (staffEmail === this.authService.getEmail()) {
        this.isDoctor = true;      
      } else {
        this.isDoctor = false;
      }
    } catch (error) {
      console.error("Error fetching staff data: ", error);
      this.isDoctor = false; 
    }
  }

  addAllergie(update : string) {  

    let allergieAdd: IAllergieMedicalRecord;
    if(update === "yes" && this.filterAllergieStatusText != "Active"){
      const info = `Doctor Email: ${this.authService.getEmail()}
      Date: ${new Date().toLocaleString('pt-PT', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })}
      Change allergy status to: ${this.filterAllergieStatusText}`;
      
      allergieAdd = {
        designacao: this.filterAllergieNameText,
        descricao: this.filterAllergieDescricaoText,
        status: this.filterAllergieStatusText,
        note: `${info}\n Note: ${this.noteAllergie}\n`,
      };
    }else{
      allergieAdd = {
        designacao: this.filterAllergieNameText,
        descricao: this.filterAllergieDescricaoText,
        status: this.filterAllergieStatusText,
        note: '',        
      };
    }   
   

    let existIndex = this.tagsAllergies.findIndex(option =>
      option.designacao.toLowerCase() === this.filterAllergieNameText.toLowerCase()
    );
  
    if(existIndex !== -1) {     
      this.tagsAllergies[existIndex].status = allergieAdd.status;
      this.tagsAllergies[existIndex].note = `${this.tagsAllergies[existIndex].note}\n${allergieAdd.note}`;
    } else {
      this.tagsAllergies.push(allergieAdd);
    }
  
    console.log(this.tagsAllergies); 

    this.cleanAllergieFilter();
    this.updateAllergieToInvalid();
  }


  addMedicalCondition(update : string) {
    let medicalConditionAdd: IMedicalConditionMedicalRecord;

    if(update === "yes" && this.filterConditionStatusText != "Active"){
      const info = `Doctor Email: ${this.authService.getEmail()}
       Date: ${new Date().toLocaleString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })}
      Change medical condition status to: ${this.filterConditionStatusText}`;
      
      medicalConditionAdd = {
        codigo: this.filterConditionCodigoText,
        designacao: this.filterTextCondition,
        descricao: this.filterConditionDescricaoText,
        status: this.filterConditionStatusText,
        sintomas:  this.sintomasCodition.split(',').map((item: string) => item.trim()),
        note: `${info}\n Note: ${this.noteCondition}\n`,
      };
    }else{
      medicalConditionAdd = {
        codigo: this.filterConditionCodigoText,
        designacao: this.filterTextCondition,
        descricao: this.filterConditionDescricaoText,
        status: this.filterConditionStatusText,
        sintomas:  this.sintomasCodition.split(',').map((item: string) => item.trim()),
        note: '',        
      };
    } 
    
    let existIndex = this.tagsConditions.findIndex(option =>
      option.designacao.toLowerCase() === this.filterTextCondition.toLowerCase()
    );
  
    if(existIndex !== -1) {      
      this.tagsConditions[existIndex].sintomas = medicalConditionAdd.sintomas;
      this.tagsConditions[existIndex].status = medicalConditionAdd.status;
      this.tagsConditions[existIndex].note = `${this.tagsConditions[existIndex].note}\n${medicalConditionAdd.note}`;
    } else {
      this.tagsConditions.push(medicalConditionAdd);
    }
  
    console.log(this.tagsConditions); 
    this.noteCondition = '';
   
    this.cleanMedicalConditionFilter();
    this.updateConditionToInvalid();
  }
  
  updateNoteMedicalCondition(){
    const info = `Doctor Email: ${this.authService.getEmail()}
       Date: ${new Date().toLocaleString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })}`;
      
      
    console.log("Entrei noteeeeee");    


    let existIndex = this.tagsConditions.findIndex(option =>
      option.codigo.toLowerCase() === this.filterConditionCodigoText.toLowerCase()
    );

    console.log("codigo", this.filterConditionCodigoText);  
    console.log("conditions", this.tagsConditions);

     
    this.tagsConditions[existIndex].note = `${this.tagsConditions[existIndex].note}\n${info}\n Note: ${this.noteCondition}\n`;

    
    console.log("NOTE", this.noteCondition);

    this.closeModal("UpdateOtherDoctorMedicalRecordModal");   

  }


  updateNoteAllergies(){
    const info = `Doctor Email: ${this.authService.getEmail()}
       Date: ${new Date().toLocaleString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })}`;
      
      
  

    let existIndex = this.tagsAllergies.findIndex(option =>
      option.designacao.toLowerCase() === this.filterAllergieNameText.toLowerCase()
    );

     
    this.tagsAllergies[existIndex].note = `${this.tagsAllergies[existIndex].note}\n${info}\n Note: ${this.noteAllergie}\n`;

    
    console.log("NOTE", this.noteAllergie);

    this.closeModal("UpdateOtherDoctorMedicalRecordModalAllergie");   

  }



  addDescription() {
    let exist = this.descricaoList.find(option =>
      option.toLowerCase() === this.filterTextDescription.toLowerCase()
    );

    if(!exist){
      this.descricaoList.push(this.filterTextDescription);
      console.log("update array: ",  this.descricaoList);
    }

    this.filterTextDescription = '';
  }

  removeDescription(index: number) {
    this.descricaoList.splice(index, 1);
  }


  removeMedicalCondition(index: number) {
      this.tagsConditions.splice(index, 1);
  }

  editMedicalConditionNote(codigo : string){
    this.filterConditionCodigoText = codigo;

    this.openModal('UpdateOtherDoctorMedicalRecordModal');   
  }


  editAllergieNote(designacao : string){
    this.filterAllergieNameText = designacao;

    this.openModal('UpdateOtherDoctorMedicalRecordModalAllergie');   
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

  onFilterMedicalRecordRequests() {
    this.filteredTagsAllergies = this.tagsAllergies.filter(allergie =>
      (!this.allergieNameFilter || allergie.designacao.toLowerCase().includes(this.allergieNameFilter.toLowerCase())) &&
      (!this.allergieDescriptionFilter || allergie.descricao.toLowerCase().includes(this.allergieDescriptionFilter.toLowerCase())) &&
      (!this.allergieStatusFilter || allergie.status.toLowerCase().includes(this.allergieStatusFilter.toLowerCase()))  &&
      (!this.allergieNoteFilter || allergie.note.toLowerCase().includes(this.allergieNoteFilter.toLowerCase()))
    );
  }


  onFilterMedicalRecordRequestsConditions() {
    const symptomsFilterArray = this.medicalConditionSymptomsFilter
      ? this.medicalConditionSymptomsFilter
          .split(',')
          .map(symptom => symptom.trim().toLowerCase()) 
      : [];
  
    this.filteredTagsConditions = this.tagsConditions.filter(condition =>
      (!this.medicalConditionNameFilter || condition.designacao.toLowerCase().includes(this.medicalConditionNameFilter.toLowerCase())) &&
      (!this.medicalConditionCodeFilter || condition.codigo.toLowerCase().includes(this.medicalConditionCodeFilter.toLowerCase())) &&
      (!this.medicalConditionDescriptionFilter || condition.descricao.toLowerCase().includes(this.medicalConditionDescriptionFilter.toLowerCase())) &&
      (!this.medicalConditionStatusFilter || condition.status.toLowerCase().includes(this.medicalConditionStatusFilter.toLowerCase())) &&
      (symptomsFilterArray.length === 0 || 
        symptomsFilterArray.every(filterSymptom =>
          condition.sintomas.some(symptom => symptom.toLowerCase().includes(filterSymptom))
        )
      ) &&
      (!this.medicalConditionNoteFilter || condition.note.toLowerCase().includes(this.medicalConditionNoteFilter.toLowerCase()))
    );
  }
  

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

  onUpdateAppointment(appointmentData: updateAppointmentDto) {
    if (!appointmentData.id) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Invalid Appointment ID!',
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

    if (!appointmentData.id) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Invalid Appointment ID!',
      });
      return;
    }

    const oldAppointment = this.appointments.find(app => app.id === appointmentData.id);

    if (!oldAppointment) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Original appointment not found!',
      });
      return;
    }

    const roomId = this.surgeryRooms.find(room => room.roomNumber.toString() === oldAppointment.roomNumber)?.id;

    if (!roomId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Room not found for old appointment!',
      });
      return;
    }


    const payload: updateAppointmentDto = {
      id: appointmentData.id,
      roomId: appointmentData.roomId || roomId,
      start: appointmentData.start || oldAppointment.date.startTime,
      selectedStaff: appointmentData.selectedStaff
    };

    console.log("Payload: ", payload);
    this.appointmentService.updateAppointments(payload).subscribe({
      next: () => {
        this.getAllAppointments();

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Appointment updated successfully!',
          showConfirmButton: false,
          timer: 1500
        });

        this.modalService.closeModal('updateAppointmentModal');
      },
      error: (error) => {
        console.error('Error updating Appointment:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update Appointment.',
        });
      }
    });
  }

  setUpdateAppointment(appointment: updateAppointmentDto){

    this.updateAppointment.id = appointment.id;
    this.updateAppointment.roomId = appointment.roomId;
    this.updateAppointment.start = appointment.start;
    this.updateAppointment.selectedStaff = [];
    this.openModal('updateAppointmentModal');

  }

  addUpdateStaffMember() {
    this.updateAppointment.selectedStaff.push('');
  }


  removeUpdateStaffMember(index: number) {
    if (index > -1) {
      this.updateAppointment.selectedStaff.splice(index, 1);
    }
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
    console.log("CRIAR MEDICAL RECORD");


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
        const staffId = staff.staffId;

        const payload: CreatingMedicalRecordUIDto = {
          staff: staffId,
          patientId: getPatientId,
          allergies: this.tagsAllergies,
          medicalConditions: this.tagsConditions.map((condition) => ({
            ...condition,
            sintomas: condition.sintomas.filter((sintoma: string) => sintoma.trim() !== ''),
          })),
          descricao: this.descricaoList,
        };


        console.log("Medical record payload:", payload);


        this.medicalRecordService.createMedicalRecord(payload).subscribe({
          next: () => {
            this.cleanMedicalRecordRegister();
            this.getAllMedicalRecords();
            this.sweetService.sweetSuccess('Medical Record created successfully!');

            this.modalService.closeModal('registerMedicalRecordModal');

            this.rejectPolicy();
          },
          error: (error: any) => {
            this.cleanMedicalRecordRegister();
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


  onBlur(field: string) {   
      setTimeout(() => {
        if (field === 'filterAllergie') {
          this.showDropdown = false;
        } else if (field === 'filterCondition') {
          this.showDropdown2 = false;
        } else if (field === 'filterAllergieStatus') {
          this.showDropdown3 = false;
        }else if (field === 'filterStatus') {
          this.showDropdown4 = false;
        }       
      }, 200);        
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

          this.staffService.viewStaff(element.staff).subscribe({
            next: (res) => {              
              element.staff =  res.email.fullEmail;
            },
          });

        });

      },
      error: (error) => {
        console.error('Error fetching requests:', error);
      }
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
      this.sweetService.sweetWarning("Please select a medical record.");
    } else {
      console.log(`Viewing Patient Id medical record: ${this.selectedPatientEmailMedicalRecord}`);

      forkJoin({
        patient: this.patientService.getPatientByEmail(this.selectedPatientEmailMedicalRecord)
      }).subscribe({
        next: ({ patient }) => {
          console.log(patient);

          console.log(patient.id.value);
          this.selectedPatientIdMedicalRecord = patient.id.value;

          const patientId = this.selectedPatientIdMedicalRecord;

          this.medicalRecordService.getAllMedicalRecordByPatientId(patientId)
          .subscribe({
            next: (response) => {
              console.log("Medical record response: ", response);
              this.medicalRecordProfileUpdate = response[0];
              console.log("Medical record: ", this.medicalRecordProfileUpdate);

              this.staffEmailSelectedMedicalRecord = this.medicalRecordProfileUpdate.staff;

              // Patch form data
              this.medicalRecordUpdate.patchValue({
                patientId: this.medicalRecordProfileUpdate.patientEmail,
                descricao: this.medicalRecordProfileUpdate.descricao
              });

              const medicalConditionsControl = this.medicalRecordUpdate.get('medicalConditions') as FormArray;
              const allergiesControl = this.medicalRecordUpdate.get('allergies') as FormArray;

              medicalConditionsControl.clear();
              allergiesControl.clear();

              this.medicalRecordProfileUpdate.medicalConditions.forEach((condition: IMedicalConditionMedicalRecord) => {
                medicalConditionsControl.push(this.fb.group({
                  codigo: [condition.codigo],
                  designacao: [condition.designacao],
                  descricao: [condition.descricao],
                  sintomas: this.fb.array(condition.sintomas || []),
                  status: [condition.status],
                  note: condition.note,
                }));
              });

              // Add existing allergies to the form
              this.medicalRecordProfileUpdate.allergies.forEach((allergy: IAllergieMedicalRecord) => {
                allergiesControl.push(this.fb.group({
                  designacao: [allergy.designacao],
                  descricao: [allergy.descricao],
                  status: [allergy.status],
                  note: allergy.note,
                }));
              });

              this.tagsConditions = this.medicalRecordProfileUpdate.medicalConditions;
              this.tagsAllergies = this.medicalRecordProfileUpdate.allergies;
              this.descricaoList = this.medicalRecordProfileUpdate.descricao;

              const updatedMedicalRecordData = this.medicalRecordUpdate.value;

              this.isDoctorAuthorized();

              console.log('Updated Patient Data:', updatedMedicalRecordData);
          
              this.openModal('UpdateMedicalRecordModal');
            }});
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

     if (this.selectedPatientEmailMedicalRecord === null) {
      this.sweetService.sweetWarning("Please select a medical record.");
    } else {
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
            this.sweetService.sweetSuccess("Medical Record deactivated successfully!")
          },
          error: (error) => {
            console.error('Error deactivating medical record:', error);
            this.errorMessage = 'Failed to deactivate medical record!';
            this.sweetService.sweetErro("Failed to deactivate medical record")
          }
        });

      }});
    }

    };



  onUpdateMedicalRecord() {
    const token = this.authService.getToken();

    if (!token) {
      this.errorMessage = 'You are not logged in!';
      return;
    }

    if (this.selectedPatientEmailMedicalRecord === null) {
      this.sweetService.sweetWarning("Please select a medical record.");
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

  updatedPatientData.descricao = this.descricaoList;


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
          this.cleanMedicalRecordRegister();

          console.error('Error editing Medical Record:', error);
          this.sweetService.sweetErro("Error editing Medical Record");

          this.errorMessage = 'Failed to edit Medical Record!';
          this.successMessage = null;
        }
      });

      this.cleanMedicalRecordRegister();
  }

   getMedicalRecord() {
      const token = this.authService.getToken();
      if (!token) {
        this.errorMessage = 'You are not logged in!';
        return;
      }
      console.log("Entrei get medical record");


      if (this.selectedPatientEmailMedicalRecord === null) {
        this.sweetService.sweetWarning("Please select a medical record.");
      } else {
      forkJoin({
        patient: this.patientService.getPatientByEmail(this.selectedPatientEmailMedicalRecord)
      }).subscribe({
        next: ({ patient }) => {

          const getPatientId = patient.id.value;
          console.log("patient id " , getPatientId);

          this.medicalRecordService.getAllMedicalRecordByPatientId(getPatientId)
            .subscribe({
              next: (response) => {
                this.medicalRecordProfile = response[0];
                console.log("Medical record: ", this.medicalRecordProfile);


                this.medicalRecordProfile.medicalConditions.forEach((condition: IMedicalConditionMedicalRecord) => {
                  this.filteredTagsConditions.push({
                    codigo: condition.codigo,
                    designacao: condition.designacao,
                    descricao: condition.descricao,
                    sintomas: condition.sintomas,
                    status: condition.status,
                    note: condition.note,
                  });
                });


                this.medicalRecordProfile.allergies.forEach((allergy: IAllergieMedicalRecord) => {
                  this.filteredTagsAllergies.push({
                    designacao: allergy.designacao,
                    descricao: allergy.descricao,
                    status: allergy.status,
                    note: allergy.note,
                  });
                });

                this.tagsConditions = this.medicalRecordProfile.medicalConditions;
                this.tagsAllergies = this.medicalRecordProfile.allergies;
                this.descricaoList = this.medicalRecordProfile.descricao;

                this.openModal('FilterMedicalRecord');
              },
              error: (error) => {
                console.error('Error fetching  medical record:', error);
                this.errorMessage = 'Failed to get medical record!';
              }
            });
          },
          error: (error: any) => {
            console.error('Error fetching patient:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to fetch patient information.',
            });
          },
        });
      }
    };





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

  cleanAllergieFilter(){
    this.filterAllergieNameText = '';
    this.filterAllergieDescricaoText = '';
    this.filterAllergieStatusText = '';
    this.noteAllergie = '';
  }

  cleanMedicalConditionFilter(){
    this.filterConditionCodigoText = '';
    this.filterTextCondition = '';
    this.filterConditionDescricaoText = '';
    this.filterConditionStatusText = '';
    this.sintomasCodition = '';
    this.noteCondition= '';
  }

  cleanMedicalRecordRegister() {
    this.tagsAllergies = [];
    this.filterText = '';
    this.filteredTagsAllergies = [];
    this.tagsConditions = [];
    this.filterTextCondition = '';
    this.filteredTagsConditions = [];

    this.descricaoList = [];

    this.filterAllergieNameText = '';
    this.filterAllergieDescricaoText = '';
    this.filterAllergieStatusText = '';
    this.noteAllergie= '';

    this.filterConditionCodigoText = '';
    this.filterTextCondition = '';
    this.filterConditionDescricaoText = '';
    this.filterConditionStatusText = '';
    this.sintomasCodition = '';
    this.noteCondition= '';

    this.filterTextDescription = '';

    this.medicalRecordRequest = {
      staff: '',
      patientId: '',
      allergies: [],
      medicalConditions: [],
      descricao: []
    };
  }
}
