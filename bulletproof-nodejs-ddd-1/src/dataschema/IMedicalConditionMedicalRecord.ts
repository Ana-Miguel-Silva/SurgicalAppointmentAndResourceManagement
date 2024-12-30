import { AllergyStatus } from "../domain/allergieStatus";

export interface IMedicalConditionMedicalRecord {
  codigo: string;
  designacao: string;
  descricao: string;
  sintomas: string[];
  status: AllergyStatus;
  note: string;
}
