import { Service, Inject } from 'typedi';

import { Document, Model, Types } from 'mongoose';
import { IMedicalRecordPersistence } from '../dataschema/IMedicalRecordPersistence';

import IMedicalRecordRepo from "../services/IRepos/IMedicalRecordRepo";

import { MedicalRecordMap } from "../mappers/MedicalRecordMap";
import { MedicalRecord } from '../domain/medicalRecord';
import { MedicalRecordId } from '../domain/medicalRecordId';


@Service()
export default class MedicalRecordRepo implements IMedicalRecordRepo {
  private models: any;

  constructor(
    @Inject('medicalRecordSchema') private MedicalRecordSchema : Model<IMedicalRecordPersistence & Document>,
    @Inject('logger') private logger
  ) { }

  private createBaseQuery (): any {
    return {
      where: {},
    }
  }

  public async exists(medicalRecord: MedicalRecord): Promise<boolean> {

    const idX = medicalRecord.medicalRecordId instanceof MedicalRecordId ? (<MedicalRecordId>medicalRecord.medicalRecordId).id.toValue() : MedicalRecord;

    const query = { medicalRecordId : idX};
    const MedicalRecordDocument = await this.MedicalRecordSchema.findOne( query );

    return !!MedicalRecordDocument === true;
  }

  public async update(MedicalRecord: MedicalRecord): Promise<void> {
    try {
        const rawMedicalRecord = MedicalRecordMap.toPersistence(MedicalRecord);

        await this.MedicalRecordSchema.updateOne(
            { patientId: rawMedicalRecord.patientId }, // Match the record by patientId
            { $set: rawMedicalRecord }, // Update the fields
            { upsert: false } // Do not create a new record if it doesn't exist
        );
    } catch (e) {
        throw e;
    }
}

    public async delete(MedicalRecord: MedicalRecord): Promise<string> {
      try {

        const query = { _id: MedicalRecord.id.toString() };

        const deleteResult = await this.MedicalRecordSchema.deleteOne(query);

        console.log('Delete Result:', deleteResult);

        if (deleteResult.deletedCount === 1) { 
          return "Medical record successfully deleted"; 
        } else { 
          return "Failed to delete medical record"; 
        }

      } catch (e) {
        throw e;
      }
    }


  public async save (MedicalRecord: MedicalRecord): Promise<MedicalRecord> {
    const query = { medicalRecordId: MedicalRecord.id.toString() };

    const MedicalRecordDocument = await this.MedicalRecordSchema.findOne( query );

    try {
      if (MedicalRecordDocument === null ) {
        const rawMedicalRecord: any = MedicalRecordMap.toPersistence(MedicalRecord);

        const MedicalRecordCreated = await this.MedicalRecordSchema.create(rawMedicalRecord);

        return MedicalRecordMap.toDomain(MedicalRecordCreated);
      } else {
        MedicalRecordDocument.descricao = MedicalRecord.descricao;
        MedicalRecordDocument.date = MedicalRecord.date;
        MedicalRecordDocument.staff = MedicalRecord.staff;
        MedicalRecordDocument.patientId = MedicalRecord.patientId;
        MedicalRecordDocument.allergies = MedicalRecord.allergies;
        MedicalRecordDocument.medicalConditions = MedicalRecord.medicalConditions;

        await MedicalRecordDocument.save();

        return MedicalRecord;
      }
    } catch (err) {
      throw err;
    }
  }


  public async findById (medicalRecordId: MedicalRecordId | string): Promise<MedicalRecord> {

    const idX = typeof medicalRecordId === 'string' ? medicalRecordId : medicalRecordId.id;

    const query = { medicalRecordId: idX };
    const MedicalRecordRecord = await this.MedicalRecordSchema.findOne( query );

    if( MedicalRecordRecord != null) {
      return MedicalRecordMap.toDomain(MedicalRecordRecord);
    }
    else
      return null;
  }

  public async findMedicalRecord (medicalRecord: string | { staff?: string; patientId?: string; allergie?: string; medicalCondition?: string; descricao?: string; id?: string }
	): Promise<MedicalRecord[] > {

     try {
      let query: any = {};

      if (typeof medicalRecord === 'string') {
        query = {
          $or: [
            { allergieId: medicalRecord },
            { staff: medicalRecord },
            { patientId: medicalRecord },
            { allergie: medicalRecord },
            { medicalCondition: medicalRecord },
            { descricao: medicalRecord }
          ]
        };
       } else {
        if (medicalRecord.id) query.medicalRecordId = medicalRecord.id;
        if (medicalRecord.staff) query.staff = medicalRecord.staff;
        if (medicalRecord.patientId) query.patientId = medicalRecord.patientId;
        if (medicalRecord.allergie) query.allergie = medicalRecord.allergie;
        if (medicalRecord.medicalCondition) query.medicalCondition = medicalRecord.medicalCondition;
        if (medicalRecord.descricao) query.descricao = medicalRecord.descricao;
      }

      const medicalRecordRecords = await this.MedicalRecordSchema.find(query);

      const medicalRecords = await Promise.all(
        medicalRecordRecords.map(async record => await MedicalRecordMap.toDomain(record))
      );

      return medicalRecords;

    } catch (e) {
      throw e;
    }
  }



}
