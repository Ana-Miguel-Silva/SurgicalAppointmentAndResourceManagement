import 'reflect-metadata';
import { expect } from 'chai';
import sinon from 'sinon';
import { Request, Response, NextFunction } from 'express';
import AllergieController from '../controllers/allergieController';
import AllergieService from '../services/allergieService';
import IAllergieRepo from '../services/IRepos/IAllergieRepo';
import { Result } from '../../src/core/logic/Result';
import IAllergieService from '../services/IServices/IAllergieService';
import Container from 'typedi';

describe('Controller and Service Allergie', () => {
  const sandbox = sinon.createSandbox();
  let allergieRepoMock: sinon.SinonStubbedInstance<IAllergieRepo>;
  let allergieService: AllergieService;
  let allergieController: AllergieController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: Partial<NextFunction>;

  beforeEach(() => {
    allergieRepoMock = {
      findById: sandbox.stub(),
      save: sandbox.stub(),
      update: sandbox.stub(),
      findByDesignacao: sandbox.stub(),
      findAllergies: sandbox.stub(),
    };

    allergieService = new AllergieService(allergieRepoMock);
    allergieController = new AllergieController(allergieService);

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

 
  it('should return error for invalid allergie creation', async () => {
    const invalidInput = { designacao: null, descricao: null };

    req.body = invalidInput;

    const createAllergieStub = sinon
      .stub(allergieService, 'createAllergie')
      .resolves(Result.fail('Dados inválidos'));

    await allergieController.createAllergie(req as Request, res as Response, next as NextFunction);

    sinon.assert.calledOnce(res.status);
    sinon.assert.calledWith(res.status, 402);

    sinon.assert.calledOnce(res.send);
    createAllergieStub.restore();
  });

  it('should fetch allergie by ID successfully', async () => {
    const allergieId = '12345';
    const expectedOutput = {
      id: allergieId,
      designacao: 'Pólen',
      descricao: 'Alergia a pólen de flores',
    };

    allergieRepoMock.findById.resolves(expectedOutput);

    req.body = allergieId;

    await allergieController.getAllergieById(req as Request, res as Response, next as NextFunction);

    sinon.assert.calledOnce(res.status);
    sinon.assert.calledWith(res.status, 200);

    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, sinon.match(expectedOutput));
  });

  it('should return error for non-existing allergie by ID', async () => {
    const allergieId = 'non-existing-id';

    allergieRepoMock.findById.resolves(null);

    req.body = allergieId;

    await allergieController.getAllergieById(req as Request, res as Response, next as NextFunction);

    sinon.assert.calledOnce(res.status);
    sinon.assert.calledWith(res.status, 404);

    sinon.assert.calledOnce(res.send);
  });

  it('should update allergie successfully', async () => {
    const allergieId = '12345';
    const mockUpdateData = {
      designacao: 'Pólen',
      descricao: 'Alergia atualizada a pólen',
    };

    const expectedOutput = {
      id: allergieId,
      ...mockUpdateData,
    };

    allergieRepoMock.findByDesignacao.resolves({ id: allergieId });
    allergieRepoMock.update.resolves(expectedOutput);

    req.query = { designacao: 'Pólen' };
    req.body = mockUpdateData;

    await allergieController.update(req as Request, res as Response, next as NextFunction);

    sinon.assert.calledOnce(res.status);
    sinon.assert.calledWith(res.status, 200);

    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, sinon.match(expectedOutput));
  });

  it('should return error for updating non-existing allergie', async () => {
    const allergieId = 'non-existing-id';
    const mockUpdateData = { designacao: 'Pólen', descricao: 'Alergia atualizada a pólen' };

    allergieRepoMock.findByDesignacao.resolves(null);

    req.query = { designacao: 'Pólen' };
    req.body = mockUpdateData;

    await allergieController.update(req as Request, res as Response, next as NextFunction);

    sinon.assert.calledOnce(res.status);
    sinon.assert.calledWith(res.status, 404);

    sinon.assert.calledOnce(res.json);
    sinon.assert.calledWith(res.json, sinon.match({ error: sinon.match.string }));
  });
});
