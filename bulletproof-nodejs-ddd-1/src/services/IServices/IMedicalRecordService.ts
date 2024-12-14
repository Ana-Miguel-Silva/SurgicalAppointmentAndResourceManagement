import { Result } from "../../core/logic/Result";
import { MedicalRecord } from "../../domain/medicalRecord";
import IAllergieDTO from "../../dto/IAllergieDTO";
import IFEMedicalRecordDTO from "../../dto/IFEMedicalRecordDTO";
import IMedicalRecordDTO from "../../dto/IMedicalRecordDTO";


export default interface IMedicalRecordService  {
  createMedicalRecord(MedicalRecordDTO: IMedicalRecordDTO):  Promise<Result<IMedicalRecordDTO>>;
  getMedicalRecordById (medicalrecordId: string): Promise<Result<IMedicalRecordDTO>>;
  getMedicalRecord (medicalrecordId: string): Promise<Result<IFEMedicalRecordDTO[] | IFEMedicalRecordDTO>>;
  getAllergiesMedicalRecord (medicalrecord: MedicalRecord): Promise<Result<string[]>>;
  getAllMedicalConditionsMedicalRecord (medicalrecord: MedicalRecord): Promise<Result<string[]>>;
}
