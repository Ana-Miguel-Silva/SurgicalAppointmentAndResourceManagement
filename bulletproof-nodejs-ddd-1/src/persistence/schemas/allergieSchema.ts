import mongoose from 'mongoose';
import { IAllergiePersistence } from '../../dataschema/IAllergiePersistence';

const Allergie = new mongoose.Schema(
  {
    allergieId: { type: String, unique: true },

    designacao: {
      type: String,
      required: [true, 'Please specify the designation for the medical condition'],
      unique: true,
      maxlength: [100, 'Descricao must be less than or equal to 100 characters long']
    },

    descricao: {
      type: String,     
      maxlength: [2048, 'Descricao must be less than or equal to 2048 characters long']
    },
  },
  { timestamps: true } 
);


export default mongoose.model<IAllergiePersistence & mongoose.Document>(
  'Allergie',
  Allergie
);
