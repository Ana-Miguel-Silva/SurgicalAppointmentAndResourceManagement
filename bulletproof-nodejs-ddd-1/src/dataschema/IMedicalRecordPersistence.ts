import { IAllergieMedicalRecord } from "./IAllergieMedicalRecord";
import { IMedicalConditionMedicalRecord } from "./IMedicalConditionMedicalRecord";

export interface IMedicalRecordPersistence {
	_id: string;
	date: Date;
	staff: string;
	patientId: string;
	allergies:  IAllergieMedicalRecord[];
	medicalConditions:  IMedicalConditionMedicalRecord[];
	descricao? : string[]
  }
