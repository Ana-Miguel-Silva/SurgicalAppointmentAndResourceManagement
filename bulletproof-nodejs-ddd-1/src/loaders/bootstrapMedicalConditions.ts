import { Container } from 'typedi';
import Logger from './logger';
import MedicalConditionService from '../services/medicalConditionService';
import { defaultmedicalConditions } from './defaultMedicalConditions';

export const bootstrapmedicalConditions = async () => {
  const medicalConditionService: MedicalConditionService = Container.get('MedicalConditionService');

  try {
    for (const medicalCondition of defaultmedicalConditions) {
      const existingAllergy = await medicalConditionService.getMedicalCondition(medicalCondition.codigo);

      if (existingAllergy.errorValue()) {
        await medicalConditionService.createMedicalConditionDefault(medicalCondition);
        Logger.info(`Added default Medical Condition: ${medicalCondition.codigo}`);
      } else {
        Logger.info(`Medical Condition already exists: ${medicalCondition.codigo}`);
      }
    }
  } catch (error) {
    Logger.error('🔥 Error bootstrapping Medical Condition: %o', error);
  }
};
