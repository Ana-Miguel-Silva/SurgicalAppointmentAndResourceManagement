
export default interface IMedicalRecordDTO {
  id: string;
  date: Date;
	staff: string;
	patientId: string;
	allergies: string[]; 
  medicalConditions: string[]; 
	descricao: string  
}
