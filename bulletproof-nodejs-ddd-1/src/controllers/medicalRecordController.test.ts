import 'reflect-metadata';
import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import { Result } from '../../src/core/logic/Result';
import IMedicalRecordService from '../services/IServices/IMedicalRecordService';
import MedicalRecordController from '../controllers/medicalRecordController';
import IFEMedicalRecordDTO from '../dto/IFEMedicalRecordDTO';
import IMedicalRecordDTO from '../dto/IMedicalRecordDTO';
import { AllergyStatus } from '../domain/allergieStatus';

describe('MedicalRecord Controller', function () {
    this.timeout(5000);

    const sandbox = sinon.createSandbox();

    beforeEach(function () {
        Container.reset();

        const MockMedicalRecordRepo = require('../repos/medicalRecordRepo').default;
        Container.set('MedicalRecordRepo', new MockMedicalRecordRepo());

        const MockMedicalRecordService = require('../services/medicalRecordService').default;
        Container.set('MedicalRecordService', new MockMedicalRecordService(Container.get('MedicalRecordRepo')));
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('should create a medical record successfully', async function () {
        const body = {
            id: '123',
            date: new Date(),
            patientId: '123',
            staff: '111',
            allergies: [{ designacao: 'Peanut', descricao: 'Severe nut allergy', status: AllergyStatus.Active, note: "", }],
            medicalConditions: [{
                codigo: 'MC001',
                designacao: 'Diabetes',
                descricao: 'Chronic condition',
                sintomas: ['Increased thirst', 'Frequent urination'],
                status: AllergyStatus.Active,
                note: "",
            }],            
            descricao: ['Teste'],

        };
        const req: Partial<Request> = { body };
        const res: Partial<Response> = { json: sinon.spy(), status: sinon.stub().returnsThis() };
        const next: Partial<NextFunction> = () => {};

        const medicalRecordServiceInstance = Container.get('MedicalRecordService');
        sinon.stub(medicalRecordServiceInstance, 'createMedicalRecord').returns(Result.ok<IMedicalRecordDTO>({ ...body }));

        const ctrl = new MedicalRecordController(medicalRecordServiceInstance as IMedicalRecordService);

        // Act
        await ctrl.createMedicalRecord(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match(body));
    });

    it('should get a medical record successfully', async function () {
      const body = {
        id: '123',
        date: new Date(),
        patientEmail: '123',
        staff: '111',
        allergies: [{ designacao: 'Peanut', descricao: 'Severe nut allergy', status: AllergyStatus.Active, note: "", }],
        medicalConditions: [{
            codigo: 'MC001',
            designacao: 'Diabetes',
            descricao: 'Chronic condition',
            sintomas: ['Increased thirst', 'Frequent urination'],
            status: AllergyStatus.Active,
            note: "",
        }],            
        descricao: ['Teste'],

    };
        const req: Partial<Request> = { params: { id: '123' } };
        const res: Partial<Response> = { json: sinon.spy(), status: sinon.stub().returnsThis() };
        const next: Partial<NextFunction> = () => {};

        const medicalRecordServiceInstance = Container.get('MedicalRecordService');
        sinon.stub(medicalRecordServiceInstance, 'getMedicalRecord').returns(Result.ok<IFEMedicalRecordDTO>({ ...body }));

        const ctrl = new MedicalRecordController(medicalRecordServiceInstance as IMedicalRecordService);

        // Act
        await ctrl.getMedicalRecord(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match(body));
    });

    it('should update a medical record successfully', async function () {
      const body = {
        id: '123',
        date: new Date(),
        patientId: '123',
        staff: '111',
        allergies: [{ designacao: 'Peanut', descricao: 'Severe nut allergy', status: AllergyStatus.Active, note: "", }],
        medicalConditions: [{
            codigo: 'MC001',
            designacao: 'Diabetes',
            descricao: 'Chronic condition',
            sintomas: ['Increased thirst', 'Frequent urination'],
            status: AllergyStatus.Active,
            note: "",
        }],            
        descricao: ['Teste'],

    };
        const req: Partial<Request> = { body };
        const res: Partial<Response> = { json: sinon.spy(), status: sinon.stub().returnsThis() };
        const next: Partial<NextFunction> = () => {};

        const medicalRecordServiceInstance = Container.get('MedicalRecordService');
        sinon.stub(medicalRecordServiceInstance, 'updateMedicalRecord').returns(Result.ok<IMedicalRecordDTO>({ ...body }));

        const ctrl = new MedicalRecordController(medicalRecordServiceInstance as IMedicalRecordService);

        // Act
        await ctrl.updateMedicalRecord(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match(body));
    });

    it('should delete a medical record successfully', async function () {
        const req: Partial<Request> = { params: { id: '123' } };
        const res: Partial<Response> = { send: sinon.spy(), status: sinon.stub().returnsThis() };
        const next: Partial<NextFunction> = () => {};

        const medicalRecordServiceInstance = Container.get('MedicalRecordService');
        const spy = sinon.stub(medicalRecordServiceInstance, 'deleteMedicalRecord').returns(Result.ok('Medical record deleted successfully'));

        const ctrl = new MedicalRecordController(medicalRecordServiceInstance as IMedicalRecordService);
        
        await ctrl.deleteMedicalRecord(<Request>req, <Response>res, <NextFunction>next);
           
    });

    it('should handle medical record not found on delete', async function () {
        const req: Partial<Request> = { params: { id: '123' } };
        const res: Partial<Response> = { send: sinon.spy(), status: sinon.stub().returnsThis() };
        const next: Partial<NextFunction> = () => {};

        const medicalRecordServiceInstance = Container.get('MedicalRecordService');
        sinon.stub(medicalRecordServiceInstance, 'deleteMedicalRecord').returns(Result.fail('Medical record not found'));

        const ctrl = new MedicalRecordController(medicalRecordServiceInstance as IMedicalRecordService);

        await ctrl.deleteMedicalRecord(<Request>req, <Response>res, <NextFunction>next);

        sinon.assert.calledOnce(res.status);
        sinon.assert.calledWith(res.status, 404);
    });
});
