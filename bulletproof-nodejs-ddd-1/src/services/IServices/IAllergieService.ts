import { Result } from "../../core/logic/Result";
import IAllergieDTO from "../../dto/IAllergieDTO";

export default interface IAllergieService  {
  createAllergie(AllergieDTO: IAllergieDTO):  Promise<Result<IAllergieDTO>>;
  getAllergies (allergie: string): Promise<Result<IAllergieDTO[] | IAllergieDTO>>; 
  getAllergieById (allergieId: string): Promise<Result<IAllergieDTO>>; 
}
