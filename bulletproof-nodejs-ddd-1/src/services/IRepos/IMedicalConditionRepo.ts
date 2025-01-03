import { Repo } from "../../core/infra/Repo";
import { MedicalCondition } from "../../domain/medicalCondition";


export default interface IMedicalConditionRepo extends Repo<MedicalCondition> {
	save(MedicalCondition: MedicalCondition): Promise<MedicalCondition>;
	findById (id: string): Promise<MedicalCondition>;
	findMedicalCondition (medicalCondition: string | {id?: string; codigo?: string;  designacao?: string;  descricao?: string; sintomas?: string[] }
	): Promise<MedicalCondition[]>
}
