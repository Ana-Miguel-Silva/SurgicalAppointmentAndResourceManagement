// patient.model.ts

export interface Patient {
  id: string; // ID do paciente
  name: string; // Nome do paciente
  dateOfBirth: string; // Data de nascimento do paciente
  medicalRecordNumber: number; // Número do registro médico
  email: string; // Email do paciente
  phone: string; // Telefone do paciente
  gender: string; // Gênero do paciente
  allergies: string[]; // Lista de alergias do paciente
  appointmentHistory?: string[]; // Histórico de consultas (opcional)
  emergencyContactName:string; // Nome do contato de emergência
  emergencyContactEmail: string; // Email do contato de emergência
  emergencyContactPhone: string; // Telefone do contato de emergência
  };

