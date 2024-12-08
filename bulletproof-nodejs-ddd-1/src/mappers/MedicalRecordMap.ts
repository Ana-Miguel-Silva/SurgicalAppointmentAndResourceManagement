import { Container } from 'typedi';

import { Mapper } from "../core/infra/Mapper";

import IMedicalRecordDTO from '../dto/IMedicalRecordDTO';

import { MedicalRecord } from "../domain/medicalRecord";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";


export class MedicalRecordMap extends Mapper<MedicalRecord> {


  public static toDTO(medicalRecord: MedicalRecord): IMedicalRecordDTO {
    return {
      id: medicalRecord.id.toString(),
      date: medicalRecord.date,
      staff: medicalRecord.staff,
      patientId: medicalRecord.patientId,
      allergies: medicalRecord.allergies,
      medicalConditions: medicalRecord.medicalConditions,
      descricao: medicalRecord.descricao
    } as IMedicalRecordDTO;
  }


  public static async toDomain(raw: any): Promise<MedicalRecord> {    
    const MedicalRecordOrError = MedicalRecord.create({
      date: new Date(raw.date),
      staff: raw.staff,
      patientId: raw.patientId,
      allergies: raw.allergies as string[],
      medicalConditions: raw.medicalConditions as string[],
      descricao: raw.descricao
    }, new UniqueEntityID(raw.id));

    MedicalRecordOrError.isFailure ? console.log(MedicalRecordOrError.error) : '';

    return MedicalRecordOrError.isSuccess ? MedicalRecordOrError.getValue() : null;
  }

  public static toPersistence(MedicalRecord: MedicalRecord): any {
    return {
      medicalRecordId: MedicalRecord.id.toString(),
      date: MedicalRecord.date,
      staff: MedicalRecord.staff,
      patientId: MedicalRecord.patientId,
      allergies: MedicalRecord.allergies,
      medicalConditions: MedicalRecord.medicalConditions,
      descricao: MedicalRecord.descricao
    };
  }
}
