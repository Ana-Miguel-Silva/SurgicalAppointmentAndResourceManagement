import { IAllergieMedicalRecord } from "../dataschema/IAllergieMedicalRecord";
import { IMedicalConditionMedicalRecord } from "../dataschema/IMedicalConditionMedicalRecord";

export default interface IFEMedicalRecordDTO {
  id: string;
  date: Date;
	staff: string;
	patientEmail: string;
	allergies: IAllergieMedicalRecord[]; 
  medicalConditions: IMedicalConditionMedicalRecord[]; 
	descricao: string  
}
