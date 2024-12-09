import { Container } from 'typedi';
import Logger from './logger';
import MedicalRecordService from '../services/medicalRecordService';
import { defaultMedicalRecords } from './defaultMedicalRecords';

export const bootstrapMedicalRecords = async () => {
  const medicalRecordService: MedicalRecordService = Container.get('MedicalRecordService');

  try {
    
    for (const medicalRecord of defaultMedicalRecords) {

      const formattedMedicalRecord = {       
        date: new Date(medicalRecord.date), 
        staff: medicalRecord.staff,
        patientId: medicalRecord.patientId,
        allergies: medicalRecord.allergies, 
        medicalConditions: medicalRecord.medicalConditions, 
        descricao: medicalRecord.descricao,
      };

      const existingMedicalRecord = await medicalRecordService.getMedicalRecord(medicalRecord.patientId);
  
      if (existingMedicalRecord.errorValue()) {
        await medicalRecordService.createMedicalRecordDefault(formattedMedicalRecord);

        Logger.info(`Added default Medical Record: ${medicalRecord.patientId}`);
      } else {
        Logger.info(`Medical Record already exists: ${medicalRecord.patientId}`);
      }
    }
  } catch (error) {
    Logger.error('🔥 Error bootstrapping Medical Record: %o', error);
  }
};
