import { Repo } from "../../core/infra/Repo";
import { Allergie } from "../../domain/allergie";
import { AllergieId } from "../../domain/allergieId";


export default interface IAllergieRepo extends Repo<Allergie> {
	save(Allergie: Allergie | string): Promise<Allergie>;
	findById (id: AllergieId | string): Promise<Allergie>;
	findAllergie (allergie: string | { designacao?: string; descricao?: string; id?: string }
	): Promise<Allergie | null> 
}
  