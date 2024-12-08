import { Service, Inject } from 'typedi';
import config from "../../config";
import IMedicalConditionDTO from '../dto/IMedicalConditionDTO';

import IMedicalConditionRepo from './IRepos/IMedicalConditionRepo';
import IMedicalConditionService from './IServices/IMedicalConditionService';
import { Result } from "../core/logic/Result";
import { MedicalConditionMap } from "../mappers/MedicalConditionMap";
import { MedicalCondition } from '../domain/medicalCondition';


@Service()
export default class MedicalConditionService implements IMedicalConditionService {
  constructor(
      @Inject(config.repos.medicalCondtion.name) private MedicalConditionRepo : IMedicalConditionRepo
  ) {}

  public async getMedicalCondition( MedicalConditionId: string): Promise<Result<IMedicalConditionDTO>> {
    try {
      const MedicalCondition = await this.MedicalConditionRepo.findMedicalCondition(MedicalConditionId);

      if (MedicalCondition === null) {
        return Result.fail<IMedicalConditionDTO>("MedicalCondition not found");
      }
      else {
        const MedicalConditionDTOResult = MedicalConditionMap.toDTO( MedicalCondition ) as IMedicalConditionDTO;
        return Result.ok<IMedicalConditionDTO>( MedicalConditionDTOResult )
        }
    } catch (e) {
      throw e;
    }
  }

  public async getMedicalConditionAll( medicalCondition: string): Promise<Result<IMedicalConditionDTO>> {
    try {

      const MedicalCondition = await this.MedicalConditionRepo.findMedicalCondition(medicalCondition);

      if (MedicalCondition === null) {
        return Result.fail<IMedicalConditionDTO>("MedicalCondition not found");
      }
      else {
        const MedicalConditionTOResult = MedicalConditionMap.toDTO( MedicalCondition ) as IMedicalConditionDTO;
        return Result.ok<IMedicalConditionDTO>( MedicalConditionTOResult )
        }
    } catch (e) {
      throw e;
    }
  }

  public async createMedicalConditionDefault(medicalCondition: { codigo: string; descricao: string; }) {
    const MedicalConditionOrError = await MedicalCondition.create( medicalCondition );

      if (MedicalConditionOrError.isFailure) {
        return Result.fail<IMedicalConditionDTO>(MedicalConditionOrError.errorValue());
      }

      const MedicalConditionResult = MedicalConditionOrError.getValue();

      await this.MedicalConditionRepo.save(MedicalConditionResult);

      const MedicalConditionDTOResult = MedicalConditionMap.toDTO( MedicalConditionResult ) as IMedicalConditionDTO;
      return Result.ok<IMedicalConditionDTO>( MedicalConditionDTOResult )    
  }


  public async createMedicalCondition(MedicalConditionDTO: IMedicalConditionDTO): Promise<Result<IMedicalConditionDTO>> {
    try {

      const MedicalConditionOrError = await MedicalCondition.create( MedicalConditionDTO );

      if (MedicalConditionOrError.isFailure) {
        return Result.fail<IMedicalConditionDTO>(MedicalConditionOrError.errorValue());
      }

      const MedicalConditionResult = MedicalConditionOrError.getValue();

      await this.MedicalConditionRepo.save(MedicalConditionResult);

      const MedicalConditionDTOResult = MedicalConditionMap.toDTO( MedicalConditionResult ) as IMedicalConditionDTO;
      return Result.ok<IMedicalConditionDTO>( MedicalConditionDTOResult )
    } catch (e) {
      throw e;
    }
  }

  /*public async updateMedicalCondition(MedicalConditionDTO: IMedicalConditionDTO): Promise<Result<IMedicalConditionDTO>> {
    try {
      const MedicalCondition = await this.MedicalConditionRepo.findById(MedicalConditionDTO.id);

      if (MedicalCondition === null) {
        return Result.fail<IMedicalConditionDTO>("MedicalCondition not found");
      }
      else {
        MedicalCondition.descricao = MedicalConditionDTO.descricao;
        MedicalCondition.designacao = MedicalConditionDTO.designacao;
        await this.MedicalConditionRepo.save(MedicalCondition);

        const MedicalConditionDTOResult = MedicalConditionMap.toDTO( MedicalCondition ) as IMedicalConditionDTO;
        return Result.ok<IMedicalConditionDTO>( MedicalConditionDTOResult )
        }
    } catch (e) {
      throw e;
    }
  }*/

}
