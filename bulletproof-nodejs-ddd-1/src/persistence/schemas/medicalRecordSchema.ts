import mongoose from 'mongoose';
import { IMedicalRecordPersistence } from '../../dataschema/IMedicalRecordPersistence';

const MedicalRecord = new mongoose.Schema(
  {
    medicalRecordId: { type: String, unique: true },
   
    date: {
      type: Date,
      required: [true, 'Please provide a date for the medical record'],
      default: Date.now()
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
        type: [String],
        default: []      
      },
    ],

    medicalConditions: [
      {
        type: [String],
        default: []
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
