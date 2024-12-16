import { Result } from "../../core/logic/Result";
import { AllergieId } from "../../domain/allergieId";
import IAllergieDTO from "../../dto/IAllergieDTO";

export default interface IAllergieService  {
  createAllergie(AllergieDTO: IAllergieDTO):  Promise<Result<IAllergieDTO>>;
  getAllergies (allergie: string): Promise<Result<IAllergieDTO[] | IAllergieDTO>>; 
  getAllergieId (allergie: string): Promise<string>; 
  getAllergieById (allergieId: string): Promise<Result<IAllergieDTO>>; 
}
