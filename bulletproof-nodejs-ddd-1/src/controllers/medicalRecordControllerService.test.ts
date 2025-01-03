import 'reflect-metadata';
import { expect } from 'chai';
import sinon from 'sinon';
import { Request, Response, NextFunction } from 'express';
import MedicalRecordController from '../controllers/medicalRecordController';
import MedicalRecordService from '../services/medicalRecordService';
import IMedicalRecordRepo from '../services/IRepos/IMedicalRecordRepo';
import { Result } from '../../src/core/logic/Result';
import IAllergieService from '../services/IServices/IAllergieService';
import IMedicalRecordService from '../services/IServices/IMedicalRecordService';
import Container from 'typedi';

describe('Controller and Service Medical Record', () => {
  const sandbox = sinon.createSandbox();
  let medicalRecordRepoMock: sinon.SinonStubbedInstance<IMedicalRecordRepo>;
  let allergieServiceMock: sinon.SinonStubbedInstance<IAllergieService>;
  let medicalConditionServiceMock: sinon.SinonStubbedInstance<IMedicalRecordService>;
  let medicalRecordService: MedicalRecordService;
  let medicalRecordController: MedicalRecordController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: Partial<NextFunction>;

  beforeEach(() => {
    medicalRecordRepoMock = {
      findById: sandbox.stub(),
      save: sandbox.stub().resolves({ id: '03402760-d205-484f-8507-ed773db0a339' }), 
      delete: sandbox.stub(),
      findMedicalRecord: sandbox.stub(),
      update: sandbox.stub(),
    };

    medicalRecordService = new MedicalRecordService(medicalRecordRepoMock, allergieServiceMock, medicalConditionServiceMock);

    medicalRecordController = new MedicalRecordController(medicalRecordService);

    req = {};
    res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.spy(),
      send: sandbox.spy(),
    };
    next = sandbox.spy();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should create medical record with sucess', async () => {
    const mockInput = {
      patientId: '12345',
      staff: 'Dr. Smith',
      date: new Date(),
      allergies: [],
      medicalConditions: [],
      descricao: ['General check-up'],
    };
  
    const expectedOutput = {
      ...mockInput,
      id: sinon.match.string,
      date: sinon.match.date,
    };
  

    medicalRecordRepoMock.save.resolves({ id: '11111', ...mockInput });
  
    req.body = mockInput;  

    await medicalRecordController.createMedicalRecord(req as Request, res as Response, next as NextFunction);
     
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, sinon.match(expectedOutput));
  });
  

  it('should return error when creating invalid medical record', async () => {
    const invalidInput = {
      patientId: null, 
      staff: null,
      date: null,
      allergies: [],
      medicalConditions: [],
      descricao: [],
    };
  
    req.body = invalidInput;
  
    const medicalRecordServiceInstance = Container.get('MedicalRecordService');
  
    const createMedicalRecordStub = sinon.stub(medicalRecordServiceInstance, 'createMedicalRecord').returns(Result.fail('Dados inválidos'));
   
    await medicalRecordController.createMedicalRecord(req as Request, res as Response, next as NextFunction);
  
    sinon.assert.calledOnce(res.status);
    sinon.assert.calledWith(res.status, 400); 
  
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, sinon.match({ error: 'Dados inválidos' }));
    createMedicalRecordStub.restore(); 
  });


  it('should return error when patientId is missing in the medical record', async () => {
    const invalidInput = {
      patientId: null, 
      staff: 'Dr. Smith',
      date: new Date(),
      allergies: [],
      medicalConditions: [],
      descricao: ['General check-up'],
    };

    req.body = invalidInput;

    const medicalRecordServiceInstance = Container.get('MedicalRecordService');
 
    const createMedicalRecordStub = sinon.stub(medicalRecordServiceInstance, 'createMedicalRecord').returns(Result.fail('Dados inválidos'));

    await medicalRecordController.createMedicalRecord(req as Request, res as Response, next as NextFunction);

    sinon.assert.calledOnce(res.status);
    sinon.assert.calledWith(res.status, 400);

    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, sinon.match({ error: 'Dados inválidos' }));

    createMedicalRecordStub.restore(); 
  });


  it('should return error when staff is missing in the medical record', async () => {
    const invalidInput = {
      patientId: '12345',
      staff: null, 
      date: new Date(),
      allergies: [],
      medicalConditions: [],
      descricao: ['General check-up'],
    };

    req.body = invalidInput;

    const medicalRecordServiceInstance = Container.get('MedicalRecordService');

    const createMedicalRecordStub = sinon.stub(medicalRecordServiceInstance, 'createMedicalRecord').returns(Result.fail('Dados inválidos'));

    await medicalRecordController.createMedicalRecord(req as Request, res as Response, next as NextFunction);

    sinon.assert.calledOnce(res.status);
    sinon.assert.calledWith(res.status, 400);

    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, sinon.match({ error: 'Dados inválidos' }));
    createMedicalRecordStub.restore(); 
  });


  it('should update medical record with success', async () => {
    const mockInput = {
        patientId: '12345',
        descricao: ['Updated check-up'],
        allergies: ['Peanuts'],
        medicalConditions: ['Asthma'],
    };

    const existingRecord = {
        id: '12345',
        patientId: '12345',
        descricao: ['Initial check-up'],
        allergies: ['None'],
        medicalConditions: ['None'],
    };


    const expectedOutput = {
      allergies: ["Peanuts"],
      date: new Date(),
      descricao: ["Updated check-up"],
      id: "12345",
      medicalConditions: ["Asthma"],
      patientId: "12345"
    };

    medicalRecordRepoMock.findMedicalRecord.resolves([existingRecord]);
    medicalRecordRepoMock.update.resolves();

    req.body = mockInput;

    const updateMedicalRecordStub = sinon.stub(medicalRecordService, 'updateMedicalRecord').resolves(Result.ok(expectedOutput));

    await medicalRecordController.updateMedicalRecord(req as Request, res as Response, next as NextFunction);

    sinon.assert.calledOnce(updateMedicalRecordStub);
    sinon.assert.calledWith(updateMedicalRecordStub, sinon.match(mockInput));

    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, sinon.match(expectedOutput));

    updateMedicalRecordStub.restore();
  });


  it('should return error when updating non-existing medical record', async () => {
    const invalidInput = {
      patientId: '12345',
      descricao: ['General check-up'],
      allergies: [],
      medicalConditions: [],
    };
  
    req.body = invalidInput;
    req.params = { id: 'non-existing-id' };
  

    const updateMedicalRecordStub = sinon.stub(medicalRecordService, 'updateMedicalRecord').resolves(Result.fail(invalidInput));

    
    await medicalRecordController.updateMedicalRecord(req as Request, res as Response, next as NextFunction);
  
    sinon.assert.calledOnce(res.status);
    sinon.assert.calledWith(res.status, 404);
  
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, sinon.match({ error: 'MedicalRecord not found' }));
    
    updateMedicalRecordStub.restore();
  });
  


  it('should delete medical record with success', async () => {
    const patientId = '12345';
    const expectedMessage = 'Medical Record was deleted';  
 
    const deleteMedicalRecordStub = sinon.stub(medicalRecordService, 'deleteMedicalRecord').resolves(Result.ok(expectedMessage));
  
    req.params = { patientId };
  
    await medicalRecordController.deleteMedicalRecord(req as Request, res as Response, next as NextFunction);
  
    sinon.assert.calledOnce(res.status);
    sinon.assert.calledWith(res.status, 200);
  
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, sinon.match({ message: expectedMessage }));

    deleteMedicalRecordStub.restore();
  });
  

});


