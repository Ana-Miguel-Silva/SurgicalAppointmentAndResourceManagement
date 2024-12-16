import { Container } from 'typedi';
import { defaultAllergies } from '../loaders/defaultAllergies'; 
import Logger from './logger';
import AllergieService from '../services/allergieService';

export const bootstrapAllergies = async () => {
  const allergieService: AllergieService = Container.get('AllergieService');

  try {
    for (const allergy of defaultAllergies) {
      const existingAllergy = await allergieService.getAllergies(allergy.designacao);

      if (existingAllergy.errorValue()) {
        await allergieService.createAllergieDefault(allergy);
        Logger.info(`Added default allergy: ${allergy.designacao}`);
      } else {
        Logger.info(`Allergy already exists: ${allergy.designacao}`);
      }
    }
  } catch (error) {
    Logger.error('🔥 Error bootstrapping allergies: %o', error);
  }
};
