/*import 'reflect-metadata';
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

describe('Integração: Controlador e Serviço Reais', () => {
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
    // Mockando o repositório
    medicalRecordRepoMock = {
      findById: sandbox.stub(),
      save: sandbox.stub(),
      delete: sandbox.stub(),
      findMedicalRecord: sandbox.stub(),
      update: sandbox.stub(),
    };

    // Instanciando o serviço real com o repositório mockado
    medicalRecordService = new MedicalRecordService(medicalRecordRepoMock, allergieServiceMock, medicalConditionServiceMock);

    // Instanciando o controlador real com o serviço real
    medicalRecordController = new MedicalRecordController(medicalRecordService);

    // Mockando os objetos Request, Response e NextFunction
    req = {};
    res = {
      status: sandbox.stub().returnsThis(),
      json: sandbox.spy(),
      send: sandbox.spy(),
    };
    next = sandbox.spy();


    medicalRecordRepoMock = {
      findById: sandbox.stub(),
      save: sandbox.stub().resolves({ id: '03402760-d205-484f-8507-ed773db0a339' }), 
      delete: sandbox.stub(),
      findMedicalRecord: sandbox.stub(),
      update: sandbox.stub(),
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('deve criar um registro médico com sucesso', async () => {
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
      id: sinon.match.string, // Verifica se `id` é uma string
      date: sinon.match.date, // Verifica se `date` é um objeto Date
    };
  
    // Simular o comportamento do repositório mockado
    medicalRecordRepoMock.save.resolves({ id: 'random-id', ...mockInput });
  
    req.body = mockInput;
  
    // Chamando o controlador
    await medicalRecordController.createMedicalRecord(req as Request, res as Response, next as NextFunction);
  
    // Verificar que o serviço foi chamado corretamente
    sinon.assert.calledOnceWithExactly(medicalRecordRepoMock.save, sinon.match(mockInput));
  
    // Verificar que a resposta correta foi enviada pelo controlador
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, sinon.match(expectedOutput));
  });
  

  it('deve retornar erro quando os dados são inválidos', async () => {
    const invalidInput = {
      patientId: '', // Dados inválidos
      staff: '',
      date: null,
      allergies: [],
      medicalConditions: [],
      descricao: [],
    };
  
    req.body = invalidInput;
  
    const medicalRecordServiceInstance = Container.get('MedicalRecordService');
    sinon.stub(medicalRecordServiceInstance, 'createMedicalRecord').returns(Result.fail('Dados inválidos'));
  
    // Simular erro no repositório ou serviço
    await medicalRecordController.createMedicalRecord(req as Request, res as Response, next as NextFunction);
  
    sinon.assert.calledOnce(res.status);
    sinon.assert.calledWith(res.status, 400); // Verifica se o status de erro foi retornado
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, sinon.match({ error: 'Dados inválidos' }));
  });
  

});*/
