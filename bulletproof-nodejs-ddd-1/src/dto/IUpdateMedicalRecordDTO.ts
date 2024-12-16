
export default interface IUpdateMedicalRecordDTO {
	patientId: string;
	allergies?: string[]; 
  medicalConditions?: string[]; 
	descricao?: string  
}
