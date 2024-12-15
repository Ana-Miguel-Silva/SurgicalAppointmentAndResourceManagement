import { Service, Inject } from 'typedi';
import config from "../../config";
import IMedicalRecordDTO from '../dto/IMedicalRecordDTO';

import IMedicalRecordRepo from './IRepos/IMedicalRecordRepo';
import IMedicalRecordService from './IServices/IMedicalRecordService';
import { Result } from "../core/logic/Result";
import { MedicalRecordMap } from "../mappers/MedicalRecordMap";
import { MedicalRecord } from '../domain/medicalRecord';
import IAllergieDTO from '../dto/IAllergieDTO';
import IAllergieService from './IServices/IAllergieService';
import { AllergieMap } from '../mappers/AllergieMap';
import IFEMedicalRecordDTO from '../dto/IFEMedicalRecordDTO';
import { Allergie } from '../domain/allergie';
import IMedicalConditionService from './IServices/IMedicalConditionService';
import { forEach } from 'lodash';
import IUpdateMedicalRecordDTO from '../dto/IUpdateMedicalRecordDTO';



@Service()
export default class MedicalRecordService implements IMedicalRecordService {
  constructor(
      @Inject(config.repos.medicalRecord.name) private MedicalRecordRepo : IMedicalRecordRepo,
      @Inject(config.services.allergie.name) private allergieServiceInstance : IAllergieService,
      @Inject(config.services.medicalCondition.name) private medicalConditionServiceInstance : IMedicalConditionService,
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


    public async getMedicalRecord(medicalRecord: string): Promise<Result<IFEMedicalRecordDTO[] | IFEMedicalRecordDTO>> {
      try {
        const medicalRecords = await this.MedicalRecordRepo.findMedicalRecord(medicalRecord);
    
        if (!medicalRecords || medicalRecords.length === 0) {
          return Result.fail<IFEMedicalRecordDTO[]>("Medical Record not found");
        }
    
        const MedicalRecordDTOResult = await Promise.all(
          medicalRecords.map(async (record) => {
  
           // const allergiesResult = await this.getAllergiesMedicalRecord(record);              
            //record.allergies = allergiesResult.getValue();

            
            //const medicalConditionsResult = await this.getAllMedicalConditionsMedicalRecord(record);   
            //record.medicalConditions = medicalConditionsResult.getValue();
            
            return MedicalRecordMap.toFEDTO( record ) as IFEMedicalRecordDTO;
          })
        );
    
        return Result.ok<IFEMedicalRecordDTO[]>(MedicalRecordDTOResult);
      } catch (e) {
        throw e;
      }
    }
    


  public async getAllergiesMedicalRecord (medicalrecord: MedicalRecord): Promise<Result<string[]>> {
    try{
      const allergies = medicalrecord.allergies;
   
      const allergiesAsString = Array.isArray(allergies)
        ? allergies.join(',')
        : allergies;
  
      return await this.getAllergieDesignacao(allergiesAsString);

    } catch (e) {
      throw e;
    }
  }

  public async getAllergieDesignacao(allergie : string): Promise<Result<string[]>>{

    const allergieArray = allergie.split(',');

    const allergiesDesignacao = await Promise.all(
      allergieArray.map(async (record) => {
        const allergie = await this.allergieServiceInstance.getAllergieById(record);
        return allergie.getValue().designacao;
      })
    );  

    return Result.ok<string[]>( allergiesDesignacao );   
    
  }

  public async getAllergieId(allergie: string): Promise<Result<string[]>> {
    try {
      const allergieArray = allergie.split(',');
      console.log("WWWWWWWWWWWw");

      const allergiesDesignacao: string[] = [];

      for (const record of allergieArray) {
        console.log("pappappa");
        const allergieResult = await this.allergieServiceInstance.getAllergieId(record);  
        console.log("PPPPPPPPPPPPPPPPPP");
       
        allergiesDesignacao.push(allergieResult);
      }
       
      return Result.ok(allergiesDesignacao);
    } catch (error) {
      return Result.fail<string[]>(`Error in getting allergie id' : ${error.message}`);
    }
  }



  public async getAllMedicalConditionsMedicalRecord (medicalrecord: MedicalRecord): Promise<Result<string[]>> {
    try{
      const medicalConditions = medicalrecord.medicalConditions;
   
      const medicalConditionsAsString = Array.isArray(medicalConditions)
        ? medicalConditions.join(',')
        : medicalConditions;
  
      return await this.getMedicalConditionDescricao(medicalConditionsAsString);

    } catch (e) {
      throw e;
    }
  }

  public async getMedicalConditionDescricao(medicalCondition : string): Promise<Result<string[]>>{
    const medicalConditionArray = medicalCondition.split(',');

    const medicalConditionsDesignacao = await Promise.all(
      medicalConditionArray.map(async (record) => {
        const medicalCondition = await this.medicalConditionServiceInstance.getMedicalConditionById(record);
        return medicalCondition.getValue().descricao;
      })
    );  

    return Result.ok<string[]>( medicalConditionsDesignacao );   
  }

  public async getMedicalConditionId(medicalCondition : string): Promise<Result<string[]>> {
    try{
      const medicalConditionArray = medicalCondition.split(',');

      const medicalConditionsDesignacao = await Promise.all(
        medicalConditionArray.map(async (record) => {
          const medicalCondition = await this.medicalConditionServiceInstance.getMedicalConditionId(record);
          if (medicalCondition.isFailure) {
            throw new Error("Error in getting Medical Condition id"); 
          }

          return medicalCondition.getValue().id.toString();
        })
      );  

      return Result.ok(medicalConditionsDesignacao);
    } catch (error) {
      return Result.fail<string[]>(`Error in getting Medical Condition id"); : ${error.message}`);
    }
  }


  public async createMedicalRecord(MedicalRecordDTO: IMedicalRecordDTO): Promise<Result<IMedicalRecordDTO>> {
    try {
      console.log("Serviço allergies inicio:" , MedicalRecordDTO.allergies);

      /*const allergies = MedicalRecordDTO.allergies;
   
      const allergiesAsString = Array.isArray(allergies)
        ? allergies.join(',')
        : allergies;
  
       
      MedicalRecordDTO.allergies = (await this.getAllergieId(allergiesAsString)).getValue();

      const medicalConditions = MedicalRecordDTO.medicalConditions;
   
      const medicalConditionsAsString = Array.isArray(medicalConditions)
        ? medicalConditions.join(',')
        : medicalConditions;
  
       
      MedicalRecordDTO.medicalConditions = (await this.getMedicalConditionId(medicalConditionsAsString)).getValue();
      console.log("Serviço allergies fim:" , MedicalRecordDTO.allergies);*/

      MedicalRecordDTO.date = new Date(Date.now());
      
      const MedicalRecordOrError = await MedicalRecord.create( MedicalRecordDTO );
      console.log("Criou medical record ", MedicalRecordOrError);

      if (MedicalRecordOrError.isFailure) {
        return Result.fail<IMedicalRecordDTO>(MedicalRecordOrError.errorValue());
      }

      const MedicalRecordResult = MedicalRecordOrError.getValue();

      await this.MedicalRecordRepo.save(MedicalRecordResult);

      const MedicalRecordDTOResult = MedicalRecordMap.toDTO( MedicalRecordResult ) as IMedicalRecordDTO;
      return Result.ok<IMedicalRecordDTO>( MedicalRecordDTOResult );

    } catch (e) {
      throw e;
    }
  }

  public async updateMedicalRecord(MedicalRecordDTO: IUpdateMedicalRecordDTO): Promise<Result<IMedicalRecordDTO>> {
    try {
      const MedicalRecords = await this.MedicalRecordRepo.findMedicalRecord(MedicalRecordDTO.patientId);
      const MedicalRecord = MedicalRecords[0];

      if (MedicalRecord === null) {
        return Result.fail<IMedicalRecordDTO>("MedicalRecord not found");
      }
      else {
        MedicalRecord.descricao = MedicalRecordDTO.descricao;
        MedicalRecord.allergies = MedicalRecordDTO.allergies;
        MedicalRecord.medicalConditions = MedicalRecordDTO.medicalConditions;
        await this.MedicalRecordRepo.update(MedicalRecord);

        const MedicalRecordDTOResult = MedicalRecordMap.toDTO( MedicalRecord ) as IMedicalRecordDTO;
        return Result.ok<IMedicalRecordDTO>( MedicalRecordDTOResult )
        }
    } catch (e) {
      throw e;
    }
  }

}
