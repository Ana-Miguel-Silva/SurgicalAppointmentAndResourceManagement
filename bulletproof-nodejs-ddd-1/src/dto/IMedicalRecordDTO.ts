import { IAllergieMedicalRecord } from "../dataschema/IAllergieMedicalRecord";
import { IMedicalConditionMedicalRecord } from "../dataschema/IMedicalConditionMedicalRecord";
import { IMedicalConditionPersistence } from "../dataschema/IMedicalConditionPersistence";

export default interface IMedicalRecordDTO {
  id: string;
  date: Date;
	staff: string;
	patientId: string;
	allergies: IAllergieMedicalRecord[];
  medicalConditions: IMedicalConditionMedicalRecord[];
	descricao: string[]
}
