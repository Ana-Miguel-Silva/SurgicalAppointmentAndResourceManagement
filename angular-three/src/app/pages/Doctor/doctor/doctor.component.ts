import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule

interface CreatingOperationRequestDto {
  medicalRecordNumber: { value: string };
  operationTypeId: { value: string };
  deadline: string;
  priority: string;
}

@Component({
  selector: 'app-operation-request',
  standalone: true,
  imports: [FormsModule, CommonModule], // Add CommonModule here
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss']
})
export class DoctorComponent implements OnInit {
  // Data model for creating an operation request
  operationRequest: CreatingOperationRequestDto = {
    medicalRecordNumber: { value: '' },
    operationTypeId: { value: '' },
    deadline: '',
    priority: ''
  };

  // Variables to store operation requests and messages
  operationRequests: any[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;

  // Inject necessary services
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.getAllOperationRequests(); // Fetch all requests on component initialization
  }

  // Method to fetch all operation requests
  getAllOperationRequests() {
    const token = this.authService.getToken();

    if (!token) {
      this.errorMessage = 'You are not logged in!';
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any[]>('https://localhost:5001/api/OperationRequests', { headers })
      .subscribe({
        next: (response) => {
          this.operationRequests = response;
        },
        error: (error) => {
          console.error('Error fetching operation requests:', error);
          this.errorMessage = 'Failed to fetch operation requests!';
        }
      });
  }

  // Method to handle form submission for creating a new request
  onSubmit() {
    const token = this.authService.getToken();

    if (!token) {
      alert('You are not logged in!');
      return;
    }

    const requestPayload: CreatingOperationRequestDto = {
      medicalRecordNumber: { value: this.operationRequest.medicalRecordNumber.value },
      operationTypeId: { value: this.operationRequest.operationTypeId.value },
      deadline: new Date(this.operationRequest.deadline).toISOString(),
      priority: this.operationRequest.priority
    };

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.post('https://localhost:5001/api/OperationRequests', requestPayload, { headers })
      .subscribe({
        next: () => {
          this.successMessage = 'Operation Request Created!';
          this.errorMessage = null;
          this.getAllOperationRequests(); // Refresh the list after creation
        },
        error: (error) => {
          console.error('Error creating operation request:', error);
          this.errorMessage = 'Failed to create operation request!';
          this.successMessage = null;
        }
      });
  }
}