import { Repo } from "../../core/infra/Repo";
import { Allergie } from "../../domain/allergie";
import { AllergieId } from "../../domain/allergieId";


export default interface IAllergieRepo extends Repo<Allergie> {
	save(Allergie: Allergie | string): Promise<Allergie>;
	findById (id: AllergieId | string): Promise<Allergie>;
	findAllergies (allergie: string | { designacao?: string; descricao?: string; id?: string }
	): Promise<Allergie[]> 
	getAllergieId (allergie: string | { designacao?: string; descricao?: string; id?: string }
	): Promise<string> 

	update(allergieId: string, updateData: Partial<{ designacao: string; descricao: string }>): Promise<Allergie | null>;

}
  