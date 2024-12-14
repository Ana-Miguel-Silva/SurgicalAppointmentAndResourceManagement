
export default interface IFEMedicalRecordDTO {
  id: string;
  date: Date;
	staff: string;
	patientEmail: string;
	allergies: string[]; 
  medicalConditions: string[]; 
	descricao: string  
}
