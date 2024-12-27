import mongoose from 'mongoose';
import { IMedicalRecordPersistence } from '../../dataschema/IMedicalRecordPersistence';

const AllergySchema = new mongoose.Schema({
  designacao: { type: String, required: true },
  descricao: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Active', 'Not Meaningful Anymore', 'Misdiagnosed'],
    required: true
  },
});

const MedicalConditionSchema = new mongoose.Schema({
  codigo: { type: String, required: true },
  designacao: { type: String, required: true },
  descricao: { type: String, default: '' },
  sintomas: { type: [String], default: '' },
  status: {
    type: String,
    enum: ['Active', 'Not Meaningful Anymore', 'Misdiagnosed'],
    required: true
  },
});

const MedicalRecordSchema = new mongoose.Schema(
  {
    medicalRecordId: {
      type: String,
      unique: true,
      required: [true, 'Please provide a medical record ID'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide a date for the medical record'],
      default: Date.now,
    },
    staff: {
      type: String,
      required: [true, 'Please specify the staff handling the record'],
    },
    patientId: {
      type: String,
      required: [true, 'Please specify the patient ID'],
      unique: true,
    },
    allergies: {
      type: [AllergySchema],
      default: [],
    },
    medicalConditions: {
      type: [MedicalConditionSchema],
      default: [],
    },
    descricao: {
      type: [String],
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IMedicalRecordPersistence & mongoose.Document>(
  'MedicalRecord',
  MedicalRecordSchema
);
