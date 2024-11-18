import { Component, inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ModalService } from './modal.service';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';


interface CreatingOperationRequestDto {
  medicalRecordNumber: { value: string };
  operationTypeId: { value: string };
  deadline: string;
  priority: string;
  patientName: string;
  requestName: string;
}

interface OperationRequest {
  id: string;
  medicalRecordNumber: string;
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
  operationRequest: CreatingOperationRequestDto = {
    medicalRecordNumber: { value: '' },
    operationTypeId: { value: '' },
    deadline: '',
    priority: '',
    patientName: '',
    requestName: ''
  };

  updateRequest: UpdateOperationRequestDto = {
    id: '',
    deadline: '',
    priority: ''
  };

  operationRequests: any[] = [];
  filteredRequests: any[] = [];
  filter = {
    priority: '',
    operationTypeName: '',
    emailPatient: '',
    emailDoctor: ''
  };

  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);
  private modalService = inject(ModalService);

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

  const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

  this.http.get<OperationRequest[]>('https://localhost:5001/api/OperationRequests', { headers })
    .subscribe({
      next: (response) => {

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Operation Type created successfully!',
          showConfirmButton: false,
          timer: 1500
        });
        
        this.operationRequests = response;
        this.applyFilter();
      },
      error: (error) => {
        console.error('Erro ao buscar requests:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to create Operation Type.',
        });
      }
    });
}

  onCreateRequest() {
    const token = this.authService.getToken();
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'You are not logged in!',
      });
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post('https://localhost:5001/api/OperationRequests', this.operationRequest, { headers })
      .subscribe({
        next: () => {
          this.getAllOperationRequests();

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Operation Type created successfully!',
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
            text: 'Failed to create Operation Type.',
          });
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
    this.applyFilter();
    this.closeModal('filterRequestModal');
  }

  onUpdateRequest() {
    const token = this.authService.getToken();
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'You are not logged in!',
      });
            return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const payload: UpdateOperationRequestDto = {
      id: this.updateRequest.id,
      deadline: this.updateRequest.deadline,
      priority: this.updateRequest.priority
    };

    this.http.patch(`https://localhost:5001/api/OperationRequests/${payload.id}`, payload, { headers })
      .subscribe({
        next: () => {
          this.getAllOperationRequests();

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Operation Type created successfully!',
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
            text: 'Failed to create Operation Type.',
          });
        }
      });
  }

  setUpdateRequest(request: any) {
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

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.delete(`https://localhost:5001/api/OperationRequests/${id}`, { headers })
      .subscribe({
        next: () => {
          this.getAllOperationRequests();

          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Operation Type created successfully!',
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
            text: 'Failed to create Operation Type.',
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
}
