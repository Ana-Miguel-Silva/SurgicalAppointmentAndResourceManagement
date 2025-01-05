import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MockAppointmentService {
  private appointments = [
    { id: '1', date: '2024-12-01', time: '10:00 AM', doctor: 'Dr. Smith', patient: 'John Doe', status: 'Scheduled' },
    { id: '2', date: '2024-12-02', time: '2:00 PM', doctor: 'Dr. Johnson', patient: 'Jane Doe', status: 'Pending' },
  ];

  scheduleAppointments(formData: any): Observable<any> {
    const scheduledAppointment = { ...formData, id: String(Date.now()), status: 'Scheduled' };
    this.appointments.push(scheduledAppointment);
    return of(scheduledAppointment);
  }

  createAppointments(formData: any): Observable<any> {
    const newAppointment = { ...formData, id: String(Date.now()), status: 'Pending' };
    this.appointments.push(newAppointment);
    return of(newAppointment);
  }

  updateAppointments(formData: any): Observable<any> {
    const index = this.appointments.findIndex(appointment => appointment.id === formData.id);
    if (index !== -1) {
      this.appointments[index] = { ...this.appointments[index], ...formData };
      return of(this.appointments[index]);
    }
    return throwError(() => new Error('Appointment not found'));
  }

  getAllAppointments(): Observable<any[]> {
    return of([...this.appointments]);
  }
}
