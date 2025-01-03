import 'reflect-metadata';
import { expect } from 'chai';
import sinon from 'sinon';

import { Result } from '../../src/core/logic/Result';
import { MedicalRecord } from '../domain/medicalRecord';
import AllergieService from './allergieService';
import MedicalRecordRepo from '../repos/medicalRecordRepo';
import MedicalRecordService from './medicalRecordService';
import MedicalConditionService from './medicalConditionService';
import medicalRecordSchema from '../persistence/schemas/medicalRecordSchema';
import logger from '../loaders/logger';
import { AllergyStatus } from '../domain/allergieStatus';
import { UniqueEntityID } from '../domain/medicalConditionId';

describe('MedicalRecordService with real repository', () => {
  const sandbox = sinon.createSandbox();
  let medicalRecordRepo: MedicalRecordRepo;
  let medicalRecordService: MedicalRecordService;
  let allergieService: AllergieService;
  let medicalConditionService: MedicalConditionService;

  beforeEach(() => {
    medicalRecordRepo = new MedicalRecordRepo(medicalRecordSchema, logger);
    medicalRecordService = new MedicalRecordService(medicalRecordRepo, allergieService, medicalConditionService);

 
    sandbox.stub(medicalRecordRepo, 'save').resolves();
    sandbox.stub(medicalRecordRepo, 'findById').resolves();
    sandbox.stub(medicalRecordRepo, 'delete').resolves();
    sandbox.stub(medicalRecordRepo, 'findMedicalRecord').resolves();
    sandbox.stub(medicalRecordRepo, 'update').resolves();  
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should create a medical record successfully', function (done) {
    this.timeout(100000); // Increase timeout for long-running tests
  
    const mockInput = {
      id: '111111',
      patientId: '12345',
      staff: '222222222',
      date: new Date(),
      allergies: [
        {
          designacao: 'Peanuts',
          descricao: 'Reaction to peanuts',
          status: AllergyStatus.Active,
          note: 'Carries an epipen',
        },
      ],
      medicalConditions: [
        {
          codigo: 'ASTH01',
          designacao: 'Asthma',
          descricao: 'Chronic respiratory condition',
          sintomas: ['Shortness of breath', 'Wheezing'],
          status: AllergyStatus.Misdiagnosed,
          note: 'Treated with inhaler',
        },
      ],
      descricao: ['General check-up'],
    };
  
    medicalRecordService.createMedicalRecord(mockInput)
      .then((result) => {
        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.have.property('patientId', '12345');
        expect(result.getValue()).to.have.property('staff', '222222222');
        done(); // Call `done` to signal completion
      })
      .catch(done); // Pass error to `done` for proper error handling
  });
  

  it('should fail to create a medical record with invalid data', async () => {
    const mockInput = {
      id: '1',
      patientId: null,
      staff: 'Dr. Smith',
      date: new Date(),
      allergies: [
        {
          designacao: 'Peanuts',
          descricao: 'Reaction to peanuts',
          status: AllergyStatus.Active, 
          note: 'Carries an epipen',
        },
      ],
      medicalConditions: [
        {
          codigo: 'ASTH01',
          designacao: 'Asthma',
          descricao: 'Chronic respiratory condition',
          sintomas: ['Shortness of breath', 'Wheezing'],
          status: AllergyStatus.Misdiagnosed, 
          note: 'Treated with inhaler',
        },
      ],
      descricao: ['General check-up'],
    };

    const result = await medicalRecordService.createMedicalRecord(mockInput);

    expect(result.isSuccess).to.be.false;
    expect(result.errorValue()).equals("patientId is null or undefined");
  });



  it('should fail to update medical record successfully', async () => {
    const mockInput = {
      id: '111111',
      patientId: '12345',
      descricao: ['Updated check-up'],
      allergies: [
        {
          designacao: 'Peanuts',
          descricao: 'Reaction to peanuts',
          status: AllergyStatus.Active, 
          note: 'Carries an epipen',
        },
      ],
      medicalConditions: [
        {
          codigo: 'ASTH01',
          designacao: 'Asthma',
          descricao: 'Chronic respiratory condition',
          sintomas: ['Shortness of breath', 'Wheezing'],
          status: AllergyStatus.Misdiagnosed, 
          note: 'Treated with inhaler',
        },
      ],
    };

    const result = await medicalRecordService.updateMedicalRecord(mockInput);

    expect(result.isSuccess).to.be.false;
    expect(result.errorValue()).to.equal('MedicalRecord not found')
});

  it('should fail to update a non-existing medical record', async () => {
    const mockInput = {
      id: null,
      patientId: null,
      descricao: ['Updated check-up'],
      allergies: [
        {
          designacao: 'Peanuts',
          descricao: 'Reaction to peanuts',
          status: AllergyStatus.Active, 
          note: 'Carries an epipen',
        },
      ],
      medicalConditions: [
        {
          codigo: 'ASTH01',
          designacao: 'Asthma',
          descricao: 'Chronic respiratory condition',
          sintomas: ['Shortness of breath', 'Wheezing'],
          status: AllergyStatus.Misdiagnosed, 
          note: 'Treated with inhaler',
        },
      ],
    };

    const result = await medicalRecordService.updateMedicalRecord(mockInput);

    expect(result.isSuccess).to.be.false;
    expect(result.errorValue()).equal("MedicalRecord not found");    
  });

  

  it('should fail to delete a non-existing medical record', async () => {
    const patientId = 'non-existing-id';   

    const result = await medicalRecordService.deleteMedicalRecord(patientId);

    expect(result.isSuccess).to.be.false;
    expect(result.error).to.equal('Medical Record not found');
    
  });
});
