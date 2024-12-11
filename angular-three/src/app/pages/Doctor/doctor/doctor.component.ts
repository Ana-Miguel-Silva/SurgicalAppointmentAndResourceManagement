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
import * as THREE from "three";
import { MedicalRecordService } from '../../../Services/medicalRecordservice';
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
  allergieDesignacao: string[];
  medicalConditionDescricao: string[];
  descricao: string
}


interface CreatingMedicalRecordUIDto {
  staff: string;
  patientEmail: string;
  allergieDesignacao: string[];
  medicalConditionDescricao: string[];
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
  filteredMedicalRecordRequests: MedicalRecordRequest[] = [];
  filterMedicalRecord = {
    date: '',
    staff: '',
    patientEmail: '',
    allergieDesignacao: '',
    medicalConditionDescricao: '',
    descricao: ''
  };


  medicalRecordRequest: CreatingMedicalRecordUIDto ={
    staff: '',
    patientEmail: '',
    allergieDesignacao: [],
    medicalConditionDescricao: [],
    descricao: ''
  }

  constructor(
    private modalService: ModalService,
    private http: HttpClient,
    private authService: AuthService,
    private operationRequestsService: OperationRequestsService,
    private allergiesService: AllergiesService,
    private medicalRecordService: MedicalRecordService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllOperationRequests();
  //  this.getAllMedicalRecords();
    this.getAllAllergies();
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
  selectedAllergieId: string | null = null;
  errorMessage: string | null = null;
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
          console.error('Error fetching  profiles:', error);
          this.errorMessage = 'Failed to fetch patients profiles!';
        }
      });
  }


  onFilterRequests() {
    this.getAllOperationRequests();
    this.applyFilter();
    this.closeModal('filterRequestModal');
  }

  onFilterMedicalRecordRequests() {
    this.getAllMedicalRecords();
    //this.applyMedicalRecordFilter();
    //this.closeModal('filterMedicalRecordRequestModal');
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

  onCreateMedicalRecord(requestData: CreatingMedicalRecordUIDto) {
    const token = this.authService.getToken();
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'You are not logged in!',
      });
      return;
    }

    const payload: CreatingMedicalRecordUIDto = {
      staff: requestData.staff,
      patientEmail: requestData.patientEmail,
      allergieDesignacao: requestData.allergieDesignacao,
      medicalConditionDescricao: requestData.medicalConditionDescricao,
      descricao: requestData.descricao
    };

    payload.staff = this.authService.getEmail();



    this.medicalRecordService.createMedicalRecord(payload).subscribe({
      next: () => {
       // this.getAllOperationRequests;

        this.cleanMedicalRecordRegister();
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Medical Record created successfully!',
          showConfirmButton: false,
          timer: 1500
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
      }
    });
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

    this.medicalRecordService.getAllMedicalRecord().subscribe({
      next: (response: MedicalRecordRequest[]) => {
        console.log("Medical Records: "+ response);
        this.medicalRecordRequests = response;

       // this.applyMedicalRecordFilter();
      },
      error: (error: any) => {
        console.error('Error fetching requests:', error);
      }
    });
  }

  applyMedicalRecordFilter() {
    this.filteredMedicalRecordRequests = this.medicalRecordRequests.filter(request => {
      const matchesAllergie = this.filterMedicalRecord.allergieDesignacao
      ? (request.allergieDesignacao as string[]).some(allergie =>
          allergie.toLowerCase().includes(this.filterMedicalRecord.allergieDesignacao.toLowerCase())
        )
      : true;

      const matchesMedicalCondition = this.filterMedicalRecord.medicalConditionDescricao
      ? (request.medicalConditionDescricao as string[]).some(medicalCondition =>
        medicalCondition.toLowerCase().includes(this.filterMedicalRecord.medicalConditionDescricao.toLowerCase())
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
    this.medicalRecordRequest = {
      staff: '',
      patientEmail: '',
      allergieDesignacao: [],
      medicalConditionDescricao: [],
      descricao: ''
    };
  }
}
