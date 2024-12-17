export interface IMedicalRecordPersistence {
	_id: string;
	date: Date;
	staff: string;
	patientId: string;
	allergies:  string[];
	medicalConditions:  string[];
	descricao? : string	
  }