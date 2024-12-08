import { Service, Inject } from 'typedi';

import { Document, FilterQuery, Model, Types } from 'mongoose';
import { IAllergiePersistence } from '../dataschema/IAllergiePersistence';

import IAllergieRepo from "../services/IRepos/IAllergieRepo";

import { AllergieMap } from "../mappers/AllergieMap";
import { AllergieId } from '../domain/allergieId';
import { Allergie } from '../domain/allergie';

@Service()
export default class AllergieRepo implements IAllergieRepo {
 
  private models: any;

  constructor(
    @Inject('allergieSchema') private allergieSchema : Model<IAllergiePersistence & Document>,
    @Inject('logger') private logger
  ) { }

  private createBaseQuery (): any {
    return {
      where: {},
    }
  }


  public async exists(allergie: Allergie): Promise<boolean> {

    const idX = allergie instanceof AllergieId ? (<AllergieId>allergie).id.toValue() : allergie;

    const query = { allergieId: idX}; 
    const AllergieDocument = await this.allergieSchema.findOne( query );

    return !!AllergieDocument === true;
  }

  public async save (Allergie: Allergie): Promise<Allergie> {
    const query = { allergieId: Allergie.id.toString() }; 

    const AllergieDocument = await this.allergieSchema.findOne( query );
    console.log(AllergieDocument);

    try {
      if (AllergieDocument === null ) {
        const rawAllergie: any = AllergieMap.toPersistence(Allergie);

        const AllergieCreated = await this.allergieSchema.create(rawAllergie);

        return AllergieMap.toDomain(AllergieCreated);
      } else {
        AllergieDocument.descricao = Allergie.descricao;
        AllergieDocument.designacao = Allergie.designacao;
        await AllergieDocument.save();

        return Allergie;
      }
    } catch (err) {
      throw err;
    }
  }


  public async findById(allergieId: AllergieId | string): Promise<Allergie | null> {

    const idX = typeof allergieId === 'string' ? allergieId : allergieId.id;

    if (typeof idX !== "string") {
        throw new Error("Invalid allergieId format: Expected a string UUID");
    }

    const query = { allergieId: idX };

    const allergieRecord = await this.allergieSchema.findOne(query);

    if (allergieRecord != null) {
        return AllergieMap.toDomain(allergieRecord);
    } else {
        return null;
    }
 }

 public async findAllergie( allergie: string | { designacao?: string; descricao?: string; id?: string }
): Promise<Allergie | null> {
  try {
    let query: any = {};

    if (typeof allergie === 'string') {
      query = {
        $or: [
          { allergieId: allergie },
          { designacao: allergie },
          { descricao: allergie }
        ]
      };
     } else {
      if (allergie.id) query.allergieId = allergie.id;
      if (allergie.designacao) query.designacao = allergie.designacao;
      if (allergie.descricao) query.descricao = allergie.descricao;
    }

    const allergieRecord = await this.allergieSchema.findOne(query);

    if (allergieRecord != null) {
      return AllergieMap.toDomain(allergieRecord);
    } else {
      return null;
    }
  } catch (e) {
    throw e;
  }
}

  
}