import mongoose from 'mongoose';
import { IMedicalConditionPersistence } from '../../dataschema/IMedicalConditionPersistence';

const MedicalCondition = new mongoose.Schema(
  {
    medicalConditionId: { type: String, unique: true },
   
    codigo: {
      type: String,
      required: [true, 'Please specify the code for the medical condition'],
      unique: true 
    },
   
    designacao: {
      type: String,
      required: [true, 'Please specify the designation for the medical condition'],
      unique: true 
    },

    descricao: {
      type: String,
      required: [true, 'Please specify the descrition for the medical condition']
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
