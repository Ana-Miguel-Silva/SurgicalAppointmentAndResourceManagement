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
  appointmentHistory: string[] = [];
  selectedPatientEmail: string | undefined;
  private patientUrl = "https://localhost:5001/api/Patients";
  actionId: any;
  allergies: any;



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
      agree: [false, Validators.requiredTrue]
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
      agree: [false, Validators.requiredTrue],
      appointmentHistory: this.fb.array([]),
      allergies: this.fb.array([])
    });
    this.patientForm = this.fb.group({});
  }


  patientForm: FormGroup;
  tags: string[] = [];  // Array para armazenar as tags
  successMessage: string | null = null;
  errorMessage: string | null = null;

  patientProfileSingle: any = null;



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
      // Add the selected date to the local appointmentHistory array
      this.appointmentHistory.push(selectedDate);

      // Get the FormArray for appointmentHistory from the form
      const appointmentHistoryControl = this.patientUpdateForm.get('appointmentHistory') as FormArray;

      // Add a new FormControl to the FormArray
      appointmentHistoryControl.push(new FormControl(selectedDate));

      // Clear the input field
      input.value = '';
    }
  }


  removeDate(index: number) {
    this.appointmentHistory.splice(index, 1);
  }



   // Método para adicionar uma tag ao array
   addTag(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim(); // Get the value from the input directly

    console.log('Input Value:', value); // Debugging line to check the input value

    // Check if the Enter key is pressed and if the value is not empty
    if (event.key === 'Enter' && value) {
      event.preventDefault();  // Prevent form submission
      this.tags.push(value);  // Add the allergy to the tags array

      // Add the allergy to the FormArray
      const allergiesControl = this.patientUpdateForm.get('allergies') as FormArray;
      allergiesControl.push(new FormControl(value));  // Add to FormArray

      // Clear the input field
      input.value = '';  // Clear the input field after adding
    }
  }


  // Method to remove a tag (allergy) by index
  removeTag(index: number) {
    // Remove from tags array
    this.tags.splice(index, 1);

    // Remove from FormArray
    const allergiesControl = this.patientUpdateForm.get('allergies') as FormArray;
    allergiesControl.removeAt(index);
  }




  onUpdatePatient() {
    const token = this.authService.getToken();

    if (!token) {
      alert('You are not logged in!');
      return;
    }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
      });

      const updatedPatientData = this.patientUpdateForm.value;
      console.log('Updated Patient Data:', updatedPatientData);

      this.http.patch(`${this.patientUrl}/${this.selectedPatientEmail}`, updatedPatientData, { headers, responseType: 'text' })
        .subscribe({
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
                preConfirm: (login) => {
                  if (!login) {
                    Swal.showValidationMessage('Please enter your code');
                  }
                  return login;
                },
                allowOutsideClick: () => !Swal.isLoading()
              }).then((result) => {
                if (result.isConfirmed) {
                  this.actionId = result.value;


                  this.http.patch(`${this.patientUrl}/${this.actionId}/${this.selectedPatientEmail}`, {}, { headers })
                  .subscribe({
                    next: (response: any) => {
                      console.log(response);
                      Swal.fire({
                        title: 'Success!',
                        text: 'Data submitted successfully.',
                        icon: 'success'
                      });
                    },
                    error: (error) => {
                      console.error('Error:', error);
                      Swal.fire({
                        title: 'Error!',
                        text: `There was a problem submitting the data: ${error.message}`,
                        icon: 'error'
                      });
                    }
                  });

                  this.viewPatient;


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
          }
        });

  }


  populateUpdateForm(): void {
    this.patientUpdateForm.patchValue({
        name: `${this.patientProfileSingle.name.firstName} ${this.patientProfileSingle.name.middleNames} ${this.patientProfileSingle.name.lastName}`,
        email: this.patientProfileSingle.email.fullEmail,
        phone: this.patientProfileSingle.phone.number,
        userEmail: this.patientProfileSingle.userEmail.fullEmail,
        gender: this.patientProfileSingle.gender,
        emergencyContactName: this.patientProfileSingle.nameEmergency,
        emergencyContactEmail: this.patientProfileSingle.emailEmergency.fullEmail,
        emergencyContactPhone: this.patientProfileSingle.phoneEmergency.number,


    });
}





  ngOnInit() {
    const token = this.authService.getToken();

    if (!token) {
      console.log("abc");
      this.errorMessage = 'You are not logged in!';
      this.router.navigate(['/']);
    }
    this.viewPatient(); // Fetch all profiles on component initialization
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
    this.http.get<any>(`${this.patientUrl}/email/${this.selectedPatientEmail}`, { headers })
      .subscribe({
        next: (response) => {
          console.log(response);
          this.patientProfileSingle = response;

        },
        error: (error) => {
          console.error('Error viewing patient:', error);
          this.errorMessage = 'Failed to view patient profile!';
        }
      });
  }

  }


