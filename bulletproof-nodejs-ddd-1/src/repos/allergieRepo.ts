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

  public async update(allergieDesignacao: string, updateData: Partial<{ designacao: string; descricao: string }>): Promise<Allergie | null> {
    try {
  
      console.log(allergieDesignacao)
      const allergieDocument = await this.allergieSchema.findOne({ designacao: allergieDesignacao });

      console.log(allergieDocument)
  
      if (!allergieDocument) {
        this.logger.warn(`Allergie with designacao ${allergieDesignacao} not found`);
        return null;
      }
  
      if (updateData.designacao) allergieDocument.designacao = updateData.designacao;
      if (updateData.descricao) allergieDocument.descricao = updateData.descricao;
  
      const updatedDocument = await allergieDocument.save();
  
      return AllergieMap.toDomain(updatedDocument);
    } catch (error) {
      this.logger.error('Error updating allergie:', error);
      throw error;
    }
  }

  public async findByDesignacao(designacao: string): Promise<Allergie | null> {
    try {
    console.log(designacao)

      const allergy = await this.allergieSchema.findOne({ designacao });
      if (!allergy) {
        console.log("A alergia não foi encontrada");
        return null;
      }
    console.log(allergy)

      return AllergieMap.toDomain(allergy) || null;  // Retorna null se não encontrar alergia

    } catch (error) {
      throw new Error('Erro ao buscar alergia por designação');
    }
  }



  public async findById(allergieId: AllergieId | string): Promise<Allergie | null> {

    const idX = typeof allergieId === 'string' ? allergieId : allergieId.id;

    const query = { allergieId: idX };

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