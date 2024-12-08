import { Repo } from "../../core/infra/Repo";
import { MedicalRecord } from "../../domain/medicalRecord";


export default interface IMedicalRecordRepo extends Repo<MedicalRecord> {
	save(MedicalRecord: MedicalRecord): Promise<MedicalRecord>;
	findById (id: string): Promise<MedicalRecord>;
}
  