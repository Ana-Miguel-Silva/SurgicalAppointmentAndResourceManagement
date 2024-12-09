import { Service, Inject } from 'typedi';
import config from "../../config";
import IMedicalRecordDTO from '../dto/IMedicalRecordDTO';

import IMedicalRecordRepo from './IRepos/IMedicalRecordRepo';
import IMedicalRecordService from './IServices/IMedicalRecordService';
import { Result } from "../core/logic/Result";
import { MedicalRecordMap } from "../mappers/MedicalRecordMap";
import { MedicalRecord } from '../domain/medicalRecord';



@Service()
export default class MedicalRecordService implements IMedicalRecordService {
  constructor(
      @Inject(config.repos.medicalRecord.name) private MedicalRecordRepo : IMedicalRecordRepo
  ) {}

  public async createMedicalRecordDefault(medicalRecord: { date: Date; staff: string; patientId: string; allergies: string[]; medicalConditions: string[]; descricao: string; }) {
  
    const MedicalRecordOrError = await MedicalRecord.create( medicalRecord );

      if (MedicalRecordOrError.isFailure) {
        return Result.fail<IMedicalRecordDTO>(MedicalRecordOrError.errorValue());
      }

      const MedicalRecordResult = MedicalRecordOrError.getValue();

      await this.MedicalRecordRepo.save(MedicalRecordResult);

      const MedicalRecordDTOResult = MedicalRecordMap.toDTO( MedicalRecordResult ) as IMedicalRecordDTO;
      return Result.ok<IMedicalRecordDTO>( MedicalRecordDTOResult )    
  }

  

  public async getMedicalRecordById( MedicalRecordId: string): Promise<Result<IMedicalRecordDTO>> {
    try {
      const MedicalRecord = await this.MedicalRecordRepo.findById(MedicalRecordId);

      if (MedicalRecord === null) {
        return Result.fail<IMedicalRecordDTO>("MedicalRecord not found");
      }
      else {
        const MedicalRecordDTOResult = MedicalRecordMap.toDTO( MedicalRecord ) as IMedicalRecordDTO;
        return Result.ok<IMedicalRecordDTO>( MedicalRecordDTOResult )
        }
    } catch (e) {
      throw e;
    }
  }

  public async getMedicalRecord( medicalRecord: string): Promise<Result<IMedicalRecordDTO>> {
    try {

      const MedicalRecord = await this.MedicalRecordRepo.findMedicalRecord(medicalRecord);

      if (MedicalRecord === null) {
        return Result.fail<IMedicalRecordDTO>("Medical Record not found");
      }
      else {
        const MedicalRecordDTOResult = MedicalRecordMap.toDTO( MedicalRecord ) as IMedicalRecordDTO;
        return Result.ok<IMedicalRecordDTO>( MedicalRecordDTOResult )
        }
    } catch (e) {
      throw e;
    }
  }


  public async createMedicalRecord(MedicalRecordDTO: IMedicalRecordDTO): Promise<Result<IMedicalRecordDTO>> {
    try {

      const MedicalRecordOrError = await MedicalRecord.create( MedicalRecordDTO );

      if (MedicalRecordOrError.isFailure) {
        return Result.fail<IMedicalRecordDTO>(MedicalRecordOrError.errorValue());
      }

      const MedicalRecordResult = MedicalRecordOrError.getValue();

      await this.MedicalRecordRepo.save(MedicalRecordResult);

      const MedicalRecordDTOResult = MedicalRecordMap.toDTO( MedicalRecordResult ) as IMedicalRecordDTO;
      return Result.ok<IMedicalRecordDTO>( MedicalRecordDTOResult )
    } catch (e) {
      throw e;
    }
  }

  /*public async updateMedicalRecord(MedicalRecordDTO: IMedicalRecordDTO): Promise<Result<IMedicalRecordDTO>> {
    try {
      const MedicalRecord = await this.MedicalRecordRepo.findById(MedicalRecordDTO.id);

      if (MedicalRecord === null) {
        return Result.fail<IMedicalRecordDTO>("MedicalRecord not found");
      }
      else {
        MedicalRecord.descricao = MedicalRecordDTO.descricao;
        MedicalRecord.designacao = MedicalRecordDTO.designacao;
        await this.MedicalRecordRepo.save(MedicalRecord);

        const MedicalRecordDTOResult = MedicalRecordMap.toDTO( MedicalRecord ) as IMedicalRecordDTO;
        return Result.ok<IMedicalRecordDTO>( MedicalRecordDTOResult )
        }
    } catch (e) {
      throw e;
    }
  }*/

}
