import mongoose from 'mongoose';
import { IMedicalRecordPersistence } from '../../dataschema/IMedicalRecordPersistence';

const MedicalRecord = new mongoose.Schema(
  {
    medicalRecordId: { type: String, unique: true },
   
    date: {
      type: Date,
      required: [true, 'Please provide a date for the medical record'],
    },

    staff: {
      type: String,
      required: [true, 'Please specify the staff handling the record'],
    },

    patientId: {
      type: String,
      required: [true, 'Please specify the patient ID'],
    },

    allergies: [
      {
        type: String,
        
      },
    ],

    medicalConditions: [
      {
        type: String, // Assuming medical conditions are stored as strings
      },
    ],

    descricao: {
      type: String
      
    },
  },
  { timestamps: true } // Adds `createdAt` and `updatedAt` fields automatically
);

export default mongoose.model<IMedicalRecordPersistence & mongoose.Document>(
  'MedicalRecord',
  MedicalRecord
);
