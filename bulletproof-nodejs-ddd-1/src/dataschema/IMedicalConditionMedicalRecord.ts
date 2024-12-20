import { AllergyStatus } from "../domain/allergieStatus";

export interface IMedicalConditionMedicalRecord {
  codigo: string;
  designacao: string;
  status: AllergyStatus;
}