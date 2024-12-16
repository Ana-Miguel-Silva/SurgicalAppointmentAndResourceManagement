import { Service, Inject } from 'typedi';
import config from "../../config";
import IAllergieDTO from '../dto/IAllergieDTO';

import IAllergieRepo from './IRepos/IAllergieRepo';
import IAllergieService from './IServices/IAllergieService';
import { Result } from "../core/logic/Result";
import { AllergieMap } from "../mappers/AllergieMap";
import { Allergie } from '../domain/allergie';
import { AllergieId } from '../domain/allergieId';

@Service()
export default class AllergieService implements IAllergieService {

  

  constructor(
      @Inject(config.repos.allergie.name) private AllergieRepo : IAllergieRepo
  ) {}

  public async createAllergieDefault(allergy: { designacao: string; descricao: string; }) {
    const AllergieOrError = await Allergie.create( allergy );

      if (AllergieOrError.isFailure) {
        return Result.fail<IAllergieDTO>(AllergieOrError.errorValue());
      }

      const AllergieResult = AllergieOrError.getValue();

      await this.AllergieRepo.save(AllergieResult);

      const AllergieDTOResult = AllergieMap.toDTO( AllergieResult ) as IAllergieDTO;
      return Result.ok<IAllergieDTO>( AllergieDTOResult )
    
  }


  public async getAllergieById( AllergieId: string): Promise<Result<IAllergieDTO>> {
    try {
      const Allergie = await this.AllergieRepo.findById(AllergieId);

      if (Allergie === null) {
        return Result.fail<IAllergieDTO>("Allergie not found");
      }
      else {
        const AllergieDTOResult = AllergieMap.toDTO( Allergie ) as IAllergieDTO;
        return Result.ok<IAllergieDTO>( AllergieDTOResult )
        }
    } catch (e) {
      throw e;
    }
  }

  public async getAllergies( allergie: string): Promise<Result<IAllergieDTO[] | IAllergieDTO>> {
    try {

      const allergies = await this.AllergieRepo.findAllergies(allergie);

      if (!allergies || allergies.length === 0) {
        return Result.fail<IAllergieDTO>("Allergie not found");
      }
      else {
        const AllergieDTOResult = allergies.map( allergie => 
        AllergieMap.toDTO( allergie ) as IAllergieDTO);

        return Result.ok<IAllergieDTO[]>( AllergieDTOResult )
        
      }
    } catch (e) {
      throw e;
    }
  }

  
  public async getAllergieId( allergieId: string): Promise<string> {
    try {

      const allergies = await this.AllergieRepo.getAllergieId(allergieId);
      console.log("id allergiesss" , allergies);

      if (!allergies ) {
        return ("Allergie not found");
      }
      else {
        console.log("id allergie" , allergies);
        return allergies;
        
      }
    } catch (e) {
      throw e;
    }
  }



  public async createAllergie(AllergieDTO: IAllergieDTO): Promise<Result<IAllergieDTO>> {
    try {

      const AllergieOrError = await Allergie.create( AllergieDTO );

      if (AllergieOrError.isFailure) {
        return Result.fail<IAllergieDTO>(AllergieOrError.errorValue());
      }

      const AllergieResult = AllergieOrError.getValue();

      await this.AllergieRepo.save(AllergieResult);

      const AllergieDTOResult = AllergieMap.toDTO( AllergieResult ) as IAllergieDTO;
      return Result.ok<IAllergieDTO>( AllergieDTOResult )
    } catch (e) {
      throw e;
    }
  }

  /*public async updateAllergie(AllergieDTO: IAllergieDTO): Promise<Result<IAllergieDTO>> {
    try {
      const Allergie = await this.AllergieRepo.findById(AllergieDTO.id);

      if (Allergie === null) {
        return Result.fail<IAllergieDTO>("Allergie not found");
      }
      else {
        Allergie.descricao = AllergieDTO.descricao;
        Allergie.designacao = AllergieDTO.designacao;
        await this.AllergieRepo.save(Allergie);

        const AllergieDTOResult = AllergieMap.toDTO( Allergie ) as IAllergieDTO;
        return Result.ok<IAllergieDTO>( AllergieDTOResult )
        }
    } catch (e) {
      throw e;
    }
  }*/

}
