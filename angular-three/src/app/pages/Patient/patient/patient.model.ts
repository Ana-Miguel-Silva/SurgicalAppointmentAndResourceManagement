// patient.model.ts

export interface Patient {
  id: string;
  name: {
    firstName: string;
    middleNames: string;
    lastName: string;
  };
  dateOfBirth: string;
  medicalRecordNumber: number;
  email: {
    fullEmail: string;
  };
  phone: {
    number: string;
  };
  gender: string;
  emergencyContactName: string;
  emergencyContactEmail: {
    fullEmail: string;
  };
  emergencyContactPhone: {
    number: string;
  };
  appointmentHistory?: string[];
  allergies: string[];
}
