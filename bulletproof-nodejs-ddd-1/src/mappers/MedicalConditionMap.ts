import { Container } from 'typedi';

import { Mapper } from "../core/infra/Mapper";

import IMedicalConditionDTO from '../dto/IMedicalConditionDTO';

import { MedicalCondition } from "../domain/medicalCondition";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";


export class MedicalConditionMap extends Mapper<MedicalCondition> {


  public static toDTO(medicalCondition: MedicalCondition): IMedicalConditionDTO {
    return {
      id: medicalCondition.id.toString(),
      codigo: medicalCondition.codigo,
      designacao: medicalCondition.designacao,
      descricao: medicalCondition.descricao,
      sintomas: medicalCondition.sintomas
    } as IMedicalConditionDTO;
  }


  public static async toDomain(raw: any): Promise<MedicalCondition> {    
    const MedicalConditionOrError = MedicalCondition.create({
      codigo: raw.codigo,
      designacao: raw.designacao,
      descricao: raw.descricao,
      sintomas: raw.sintomas
    }, new UniqueEntityID(raw.id));

    MedicalConditionOrError.isFailure ? console.log(MedicalConditionOrError.error) : '';

    return MedicalConditionOrError.isSuccess ? MedicalConditionOrError.getValue() : null;
  }

  public static toPersistence(medicalCondition: MedicalCondition): any {
    return {
      medicalConditionId: medicalCondition.id.toString(),
      codigo: medicalCondition.codigo,
      designacao: medicalCondition.designacao,
      descricao: medicalCondition.descricao,
      sintomas: medicalCondition.sintomas
    };
  }
}
