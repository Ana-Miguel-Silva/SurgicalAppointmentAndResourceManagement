import { Result } from "../../core/logic/Result";
import { MedicalConditionId } from "../../domain/medicalConditionId";
import IMedicalConditionDTO from "../../dto/IMedicalConditionDTO";


export default interface IMedicalConditionService  {
  createMedicalCondition(MedicalConditionDTO: IMedicalConditionDTO):  Promise<Result<IMedicalConditionDTO>>;
  getMedicalCondition (medicalConditionId: string): Promise<Result<IMedicalConditionDTO[] |IMedicalConditionDTO>>;
  getMedicalConditionId (medicalConditionId: string): Promise<Result<MedicalConditionId>>;
  getMedicalConditionById (medicalConditionId: string): Promise<Result<IMedicalConditionDTO>>;

}
