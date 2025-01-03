import 'reflect-metadata';
import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import { Result } from '../../src/core/logic/Result';
import IMedicalConditionService from '../services/IServices/IMedicalConditionService';
import MedicalConditionController from '../controllers/medicalConditionController';
import IMedicalConditionDTO from '../dto/IMedicalConditionDTO';

describe('MedicalCondition Controller', function () {
  this.timeout(5000);

  const sandbox = sinon.createSandbox();

  beforeEach(function () {
    Container.reset();

    const MockMedicalConditionService = require('../services/medicalConditionService').default;
    Container.set('MedicalConditionService', new MockMedicalConditionService());

    const MockMedicalConditionRepo = require('../repos/medicalConditionRepo').default;
    Container.set('MedicalConditionRepo', new MockMedicalConditionRepo());
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should create a medical condition successfully', async function () {
    const body = {
      id: '1111',
      codigo: 'MC001',
      designacao: 'Diabetes',
      descricao: 'Chronic condition',
      sintomas: ['Increased thirst', 'Frequent urination'],
      status: 'Active',
      note: 'Test condition',
    };

    const req: Partial<Request> = { body };
    const res: Partial<Response> = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    const next: Partial<NextFunction> = () => {};

    const medicalConditionServiceInstance = Container.get('MedicalConditionService');
    sinon.stub(medicalConditionServiceInstance, 'createMedicalCondition').returns(Result.ok<IMedicalConditionDTO>(body));

    const ctrl = new MedicalConditionController(medicalConditionServiceInstance as IMedicalConditionService);

    // Act
    await ctrl.createMedicalCondition(<Request>req, <Response>res, <NextFunction>next);

    // Assert
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, sinon.match(body));
  });

  it('should get a medical condition by code successfully', async function () {
    const body = {
      id: '1111',
      codigo: 'MC001',
      designacao: 'Diabetes',
      descricao: 'Chronic condition',
      sintomas: ['Increased thirst', 'Frequent urination'],
      status: 'Active',
      note: 'Test condition',
    };

    const req: Partial<Request> = { params: { codigo: 'MC001' } };
    const res: Partial<Response> = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    const next: Partial<NextFunction> = () => {};

    const medicalConditionServiceInstance = Container.get('MedicalConditionService');
    sinon.stub(medicalConditionServiceInstance, 'getMedicalCondition').returns(Result.ok<IMedicalConditionDTO>(body));

    const ctrl = new MedicalConditionController(medicalConditionServiceInstance as IMedicalConditionService);

    // Act
    await ctrl.getMedicalCondition(<Request>req, <Response>res, <NextFunction>next);

    // Assert
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, sinon.match(body));
  });

  it('should get a medical condition by id successfully', async function () {
    const body = {
      id: '123',
      codigo: 'MC001',
      designacao: 'Diabetes',
      descricao: 'Chronic condition',
      sintomas: ['Increased thirst', 'Frequent urination'],
      status: 'Active',
      note: 'Test condition',
    };

    const req: Partial<Request> = { params: { medicalConditionId: '123' } };
    const res: Partial<Response> = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    const next: Partial<NextFunction> = () => {};

    const medicalConditionServiceInstance = Container.get('MedicalConditionService');
    sinon.stub(medicalConditionServiceInstance, 'getMedicalConditionById').returns(Result.ok<IMedicalConditionDTO>(body));

    const ctrl = new MedicalConditionController(medicalConditionServiceInstance as IMedicalConditionService);

    // Act
    await ctrl.getMedicalConditionById(<Request>req, <Response>res, <NextFunction>next);

    // Assert
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, sinon.match(body));
  });

  it('should update a medical condition by id successfully', async function () {
    const body = {
      id: '123',
      codigo: 'MC001',
      designacao: 'Diabetes',
      descricao: 'Chronic condition',
      sintomas: ['Increased thirst', 'Frequent urination'],
      status: 'Active',
      note: 'Updated condition',
    };

    const req: Partial<Request> = { 
      params: { medicalConditionId: '123' }, 
      body: { ...body, note: 'Updated condition' }
    };
    const res: Partial<Response> = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    const next: Partial<NextFunction> = () => {};

    const medicalConditionServiceInstance = Container.get('MedicalConditionService');
    sinon.stub(medicalConditionServiceInstance, 'updateMedicalConditionById').returns(Result.ok<IMedicalConditionDTO>(body));

    const ctrl = new MedicalConditionController(medicalConditionServiceInstance as IMedicalConditionService);

    // Act
    await ctrl.updateMedicalConditionById(<Request>req, <Response>res, <NextFunction>next);

    // Assert
    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, sinon.match(body));
  });

  it('should return 404 when medical condition not found on update', async function () {
    const req: Partial<Request> = { 
      params: { medicalConditionId: '123' },
      body: { codigo: 'MC001', designacao: 'Diabetes' }
    };
    const res: Partial<Response> = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    const next: Partial<NextFunction> = () => {};

    const medicalConditionServiceInstance = Container.get('MedicalConditionService');
    sinon.stub(medicalConditionServiceInstance, 'updateMedicalConditionById').returns(Result.fail('Medical condition not found'));

    const ctrl = new MedicalConditionController(medicalConditionServiceInstance as IMedicalConditionService);

    // Act
    await ctrl.updateMedicalConditionById(<Request>req, <Response>res, <NextFunction>next);

    // Assert
    sinon.assert.calledOnce(res.status);
    sinon.assert.calledWith(res.status, 404);
  });
});
