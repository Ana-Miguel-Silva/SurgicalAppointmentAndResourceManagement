import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ModalService } from '../../../Services/modal.service';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { OperationRequestsService } from '../../../Services/operationRequest.service';

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

@Component({
  selector: 'app-operation-request',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent implements OnInit {
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

  constructor(
    private modalService: ModalService,
    private http: HttpClient,
    private authService: AuthService,
    private operationRequestsService: OperationRequestsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllOperationRequests();
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

  onFilterRequests() {
    this.getAllOperationRequests();
    this.applyFilter();
    this.closeModal('filterRequestModal');
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
}
