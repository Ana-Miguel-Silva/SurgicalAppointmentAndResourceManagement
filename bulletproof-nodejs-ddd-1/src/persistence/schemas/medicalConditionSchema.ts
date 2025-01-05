import mongoose from 'mongoose';
import { IMedicalConditionPersistence } from '../../dataschema/IMedicalConditionPersistence';

const MedicalCondition = new mongoose.Schema(
  {
    medicalConditionId: { type: String, unique: true },
   
    codigo: {
      type: String,
      required: [true, 'Please specify the code for the medical condition'],
      match: [
        /^[A-Z0-9]?[A-Z][0-9]{2}(\.[0-9])?[A-Z]?$/i,
        'Code mus follow ICD-11 Standards'
      ],
      unique: true 
    },
   
    designacao: {
      type: String,
      required: [true, 'Please specify the designation for the medical condition'],
      maxlength: [100, 'Designation cannot exceed 100 characters'],
      unique: true 
    },

    descricao: {
      type: String,
      required: [true, 'Please specify the descrition for the medical condition'],
      maxlength: [2048, 'Description cannot exceed 2048 characters'],
    },

    sintomas: {
      type: [String],
      default: []
    },
  },
  { timestamps: true } // Adds `createdAt` and `updatedAt` fields automatically
);

export default mongoose.model<IMedicalConditionPersistence & mongoose.Document>(
  'MedicalCondition',
  MedicalCondition
);
