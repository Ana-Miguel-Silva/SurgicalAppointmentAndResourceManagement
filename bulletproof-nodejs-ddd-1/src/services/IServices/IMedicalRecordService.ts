import { Result } from "../../core/logic/Result";
import IMedicalRecordDTO from "../../dto/IMedicalRecordDTO";


export default interface IMedicalRecordService  {
  createMedicalRecord(MedicalRecordDTO: IMedicalRecordDTO):  Promise<Result<IMedicalRecordDTO>>;
  getMedicalRecord (medicalrecordId: string): Promise<Result<IMedicalRecordDTO>>; 
}
