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

    const query = { allergieId: allergieId };

    const allergieRecord = await this.allergieSchema.findOne(query);
   
    if (allergieRecord != null) {
        return AllergieMap.toDomain(allergieRecord);
    } else {
        return null;
    }
 }

 public async findAllergies(
  filter: string | { designacao?: string; descricao?: string; id?: string }
): Promise<Allergie[]> {
  try {
    let query: any = {};

    if (typeof filter === 'string') {
      query = {
        $or: [
          { allergieId: filter },
          { designacao: filter },
          { descricao: filter }
        ]
      };
    } else {
      if (filter.id) query.allergieId = filter.id;
      if (filter.designacao) query.designacao = filter.designacao;
      if (filter.descricao) query.descricao = filter.descricao;
    }

    const allergieRecords = await this.allergieSchema.find(query);

    // Transformação assíncrona
    const allergies = await Promise.all(
      allergieRecords.map(async record => await AllergieMap.toDomain(record))
    );

    return allergies;
  } catch (e) {
    throw e;
  }
}

public async  getAllergieId (filter: string | { designacao?: string; descricao?: string; id?: string }
): Promise<string> {
  try {
    let query: any = {};

    if (typeof filter === 'string') {
      query = {
        $or: [
          { allergieId: filter },
          { designacao: filter },
          { descricao: filter }
        ]
      };
    } else {
      if (filter.id) query.allergieId = filter.id;
      if (filter.designacao) query.designacao = filter.designacao;
      if (filter.descricao) query.descricao = filter.descricao;
    }

    const allergieRecords = await this.allergieSchema.findOne(query);

    
    const allergies = await AllergieMap.toDomain(allergieRecords);

    return allergies.allergieId.id.toString();
  } catch (e) {
    throw e;
  }
}


  
}