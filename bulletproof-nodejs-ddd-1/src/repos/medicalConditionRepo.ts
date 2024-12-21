import { Service, Inject } from 'typedi';

import { Document, Model, Types } from 'mongoose';
import { IMedicalConditionPersistence } from '../dataschema/IMedicalConditionPersistence';

import IMedicalConditionRepo from "../services/IRepos/IMedicalConditionRepo";

import { MedicalConditionMap } from "../mappers/MedicalConditionMap";
import { MedicalCondition } from '../domain/medicalCondition';
import { MedicalConditionId } from '../domain/medicalConditionId';
import { AllergieId } from '../domain/allergieId';


@Service()
export default class MedicalConditionRepo implements IMedicalConditionRepo {
  private models: any;

  constructor(
    @Inject('medicalConditionSchema') private MedicalConditionSchema : Model<IMedicalConditionPersistence & Document>,
    @Inject('logger') private logger
  ) { }

  private createBaseQuery (): any {
    return {
      where: {},
    }
  }

  public async exists(medicalCondition: MedicalCondition): Promise<boolean> {

    const idX = medicalCondition instanceof MedicalConditionId ? (<MedicalConditionId>medicalCondition.MedicalConditionId).id.toValue() : MedicalCondition;

    const query = { medicalConditionId: idX};
    const MedicalConditionDocument = await this.MedicalConditionSchema.findOne( query );

    return !!MedicalConditionDocument === true;
  }

  public async save (MedicalCondition: MedicalCondition): Promise<MedicalCondition> {
    const query = { codigo: MedicalCondition.codigo.toString() };
    const MedicalConditionDocument = await this.MedicalConditionSchema.findOne( query );

    try {
      if (MedicalConditionDocument === null ) {
        const rawMedicalCondition: any = MedicalConditionMap.toPersistence(MedicalCondition);

        const MedicalConditionCreated = await this.MedicalConditionSchema.create(rawMedicalCondition);

        return MedicalConditionMap.toDomain(MedicalConditionCreated);
      } else {
        MedicalConditionDocument.descricao = MedicalCondition.descricao;
        MedicalConditionDocument.designacao = MedicalCondition.designacao;
        MedicalConditionDocument.codigo = MedicalCondition.codigo;
        MedicalConditionDocument.sintomas = MedicalCondition.sintomas;
        await MedicalConditionDocument.save();

        return MedicalCondition;
      }
    } catch (err) {
      throw err;
    }
  }


  public async findById (medicalConditionId: MedicalConditionId | string): Promise<MedicalCondition> {

    const query = { codigo: medicalConditionId };
    console.log(query);
    const MedicalConditionRecord = await this.MedicalConditionSchema.findOne( query );
    if( MedicalConditionRecord != null) {
      return MedicalConditionMap.toDomain(MedicalConditionRecord);
    }
    else
      return null;
  }

  public async findMedicalCondition( medicalCondition: string | {id?: string; codigo?: string;  designacao?: string;  descricao?: string; sintomas?: string[] }
  ): Promise<MedicalCondition[] > {
    try {
      let query: any = {};

      if (typeof medicalCondition === 'string') {
        query = {
          $or: [
            { allergieId: medicalCondition },
            { codigo: medicalCondition },
            { designacao: medicalCondition },
            { descricao: medicalCondition },
            { sintomas: medicalCondition }
          ]
        };
       } else {
        if (medicalCondition.id) query.allergieId = medicalCondition.id;
        if (medicalCondition.descricao) query.descricao = medicalCondition.descricao;
        if (medicalCondition.designacao) query.designacao = medicalCondition.designacao;
        if (medicalCondition.sintomas) query.sintomas = medicalCondition.sintomas;
        if (medicalCondition.codigo) query.codigo = medicalCondition.codigo;
      }

      const medicalConditionRecord = await this.MedicalConditionSchema.find(query);

      const medicalConditions = await Promise.all(
        medicalConditionRecord.map(async record => await MedicalConditionMap.toDomain(record))
      );

      return medicalConditions;

    } catch (e) {
      throw e;
    }
  }
}
