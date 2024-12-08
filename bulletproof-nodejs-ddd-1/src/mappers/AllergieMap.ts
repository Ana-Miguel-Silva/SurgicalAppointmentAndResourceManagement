import { Container } from 'typedi';

import { Mapper } from "../core/infra/Mapper";

import IAllergieDTO from '../dto/IAllergieDTO';

import { Allergie } from "../domain/allergie";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";


export class AllergieMap extends Mapper<Allergie> {


  public static toDTO(allergie: Allergie): IAllergieDTO {
    return {
      id: allergie.id.toString(),
      designacao: allergie.designacao,
      descricao: allergie.descricao
    } as IAllergieDTO;
  }


  public static async toDomain(raw: any): Promise<Allergie> {    
    const allergieOrError = Allergie.create({
      designacao: raw.designacao,
      descricao: raw.descricao
    }, new UniqueEntityID(raw.id));

    allergieOrError.isFailure ? console.log(allergieOrError.error) : '';

    return allergieOrError.isSuccess ? allergieOrError.getValue() : null;
  }

  public static toPersistence(allergie: Allergie): any {
    return {     
      allergieId: allergie.id.toString(),
      designacao: allergie.designacao,
      descricao: allergie.descricao
    };
  }
}
