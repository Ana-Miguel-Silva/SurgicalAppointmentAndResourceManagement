import { AllergyStatus } from "../domain/allergieStatus";

export interface IAllergieMedicalRecord {
  designacao: string;
  descricao: string;
  status: AllergyStatus;
}