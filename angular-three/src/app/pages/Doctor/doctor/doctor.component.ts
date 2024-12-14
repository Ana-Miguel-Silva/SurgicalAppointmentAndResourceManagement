import { Component, OnInit, AfterViewInit, ElementRef, Input, ViewChild} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../../Services/modal.service';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { OperationRequestsService } from '../../../Services/operationRequest.service';
import { AllergiesService } from '../../../Services/allergies.service';
import { MedicalConditionService } from '../../../Services/medicalCondition.service';
import { PatientService } from '../../../Services/patient.service';
import { StaffService } from '../../../Services/staff.service';
import * as THREE from "three";
import { MedicalRecordService } from '../../../Services/medicalRecordservice';
import { forkJoin } from 'rxjs';
//import Orientation from './map/orientation';
//import ThumbRaiser from './map/hospital';

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


interface UpdateOperationRequestDto {
  id: string;
  deadline?: string;
  priority?: string;
}

interface MedicalRecordRequest {
  id: string;
  date: Date;
  staff: string;
  patientEmail: string;
  allergies: string[];
  medicalConditions: string[];
  descricao: string
}


interface CreatingMedicalRecordUIDto {
  staff: string;
  patientId: string;
  allergies: string[];
  medicalConditions: string[];
  descricao: string
}



@Component({
  selector: 'app-operation-request',
  standalone: true,
  imports: [FormsModule, CommonModule],
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
  tags: string[] = [];
  tagsConditions: string[] = [];

  animate() {
    requestAnimationFrame(() => this.animate());
    // Update the game (call update method of thumbRaiser)
    //this.thumbRaiser.update();
  }

  /*ngAfterViewInit(): void {
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
  filteredRequests: OperationRequest[] = [];
  filter = {
    priority: '',
    operationTypeName: '',
    emailPatient: '',
    emailDoctor: ''
  };

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

  constructor(
    private modalService: ModalService,
    private http: HttpClient,
    private authService: AuthService,
    private operationRequestsService: OperationRequestsService,
    private allergiesService: AllergiesService,
    private medicalConditionService: MedicalConditionService,
    private medicalRecordService: MedicalRecordService,
    private patientService : PatientService,
    private staffService : StaffService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllOperationRequests();
    this.getAllMedicalRecords();
    this.getAllAllergies();
    this.getAllMedicalConditions();
  }


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
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
  medicalConditionsList: any[] = [];
  //medicalRecordList: any[] = [];
  newMedicalCondition: string = '';
  newAllergy: string = '';
  filteredOptions: any[] = [];
  filteredOptionsConditions: any[] = [];
  selectedAllergieId: string | null = null;
  errorMessage: string | null = null;
  filterText: string = ''; 
  filterTextCondition: string = '';
  showDropdown: boolean = false; 
  showDropdown2: boolean = false; 
  selectedAllergie: string | null =null;

  selectAllergie(id: string){
      this.selectedAllergie = this.selectedAllergie === id ? null : id;
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

  filterOptionsMedicalConditions(): void {
    const filterValueCondition = this.filterTextCondition.toLowerCase();
    this.filteredOptionsConditions = this.medicalConditionsList.filter(option =>
      option.descricao.toLowerCase().includes(filterValueCondition),

    );
  }

  selectOption(option: string): void {
    this.filterText = option;
    this.showDropdown = false;
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

    
    forkJoin({
      patient: this.patientService.getPatientByEmail(requestData.patientId),
      staff: this.staffService.getStaffByEmail(staffEmail),
    }).subscribe({
      next: ({ patient, staff }) => {
        console.log("STAFF: ", staff);
        const getPatientId = patient.id.value;
        const staffId = staff.id;

        const payload: CreatingMedicalRecordUIDto = {
          staff: staffId,
          patientId: getPatientId,
          allergies: this.tags,
          medicalConditions: this.tagsConditions,
          descricao: requestData.descricao,
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
          },
          error: (error: any) => {
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
        console.error('Error fetching patient or staff:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch patient or staff information.',
        });
      },
    });
  }




  /*addAllergy(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    if (event.key === 'Enter' && value) {    
          event.preventDefault(); 
          this.tags.push(value);       
          
          input.value = '';        
    }

  }

  removeAllergy(index: number) {
    this.tags.splice(index, 1);
  }*/


  selectOptionTag(option: string) {
    if (!this.tags.includes(option)) {
      this.tags.push(option);
    }
    this.filterText = '';
    this.showDropdown = false;
  }

  selectOptionMedicalCondition(option: string) {
    if (!this.tagsConditions.includes(option)) {
      this.tagsConditions.push(option);
    }
    this.filterTextCondition = '';
    this.showDropdown2 = false;
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

  addTagConditionFromInput(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.filterTextCondition.trim()) {
      const newTagConditon = this.filterTextCondition.trim();
      if (!this.tagsConditions.includes(newTagConditon)) {
        this.tagsConditions.push(newTagConditon);
      }
      this.filterTextCondition = '';
      this.showDropdown2 = false;
    }
  }

  removeTag(index: number) {
    this.tags.splice(index, 1);
    this.filterText = '';
  }

  removeMedicalCondition(index: number) {
    this.tagsConditions.splice(index, 1);
    this.filterTextCondition = '';
  }

  onBlur() {   
    setTimeout(() => (this.showDropdown = false), 200);
    setTimeout(() => (this.showDropdown2 = false), 200);
  }


  addMedicalCondition() {
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
  }





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

        console.log("medical records: " , response);


      },
      error: (error) => {
        console.error('Error fetching requests:', error);
      }
    });
  }

  applyMedicalRecordFilter() {
    this.filteredMedicalRecordRequests = this.medicalRecordRequests.filter(request => {
      const matchesAllergie = this.filterMedicalRecord.allergies
      ? (request.allergies as string[]).some(allergie =>
          allergie.toLowerCase().includes(this.filterMedicalRecord.allergies.toLowerCase())
        )
      : true;

      const matchesMedicalCondition = this.filterMedicalRecord.medicalConditions
      ? (request.medicalConditions as string[]).some(medicalCondition =>
        medicalCondition.toLowerCase().includes(this.filterMedicalRecord.medicalConditions.toLowerCase())
        )
      : true;

      return matchesAllergie && matchesMedicalCondition;
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

  cleanMedicalRecordRegister() {
    this.tags = [];
    this.filterText = '';
    this.tagsConditions = [];
    this.filterTextCondition = '';
    this.medicalRecordRequest = {
      staff: '',
      patientId: '',
      allergies: [],
      medicalConditions: [],
      descricao: ''
    };
  }
}
