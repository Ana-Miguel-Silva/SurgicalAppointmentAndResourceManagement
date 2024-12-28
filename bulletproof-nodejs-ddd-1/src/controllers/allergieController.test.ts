import 'reflect-metadata';
import * as sinon from 'sinon';
import { Response, Request, NextFunction } from 'express';
import { Container } from 'typedi';
import { Result } from '../../src/core/logic/Result';
import IAllergyService from "../services/IServices/IAllergieService";
import AllergyController from "../controllers/allergieController";
import IAllergyDTO from '../dto/IAllergieDTO';

describe('Allergy Controller', function () {
    this.timeout(10000);

    const sandbox = sinon.createSandbox();

    beforeEach(function () {
        Container.reset();
    
        const allergySchemaInstance = require("../persistence/schemas/allergieSchema").default;
        Container.set("allergieSchema", allergySchemaInstance);
    
        const MockAllergyRepo = require("../repos/allergieRepo").default;
        Container.set("AllergyRepo", new MockAllergyRepo());
    
        const MockAllergyService = require("../services/allergieService").default;
        Container.set("AllergyService", new MockAllergyService(Container.get("AllergyRepo")));
    });
    

    afterEach(function() {
        sandbox.restore();
    });

    it('should create an allergy successfully', async function () {
        let body = { "designacao": 'Peanut', "descricao": 'A common nut allergy' };
        let req: Partial<Request> = {};
        req.body = body;
        let res: Partial<Response> = { json: sinon.spy(), status: sinon.stub().returnsThis() };
        let next: Partial<NextFunction> = () => {};

        let allergyServiceInstance = Container.get("AllergyService");
        sinon.stub(allergyServiceInstance, "createAllergie").returns(Result.ok<IAllergyDTO>({ id: '123', designacao: req.body.designacao, descricao: req.body.descricao }));

        const ctrl = new AllergyController(allergyServiceInstance as IAllergyService);

        // Act
        await ctrl.createAllergie(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({ id: '123', designacao: req.body.designacao, descricao: req.body.descricao }));
    });

    it('should get all allergies successfully', async function () {
        const req: Partial<Request> = {};
        const res: Partial<Response> = { json: sinon.spy(), status: sinon.stub().returnsThis() };
        const next: Partial<NextFunction> = () => {};

        const allergyServiceInstance = Container.get("AllergyService");
        sinon.stub(allergyServiceInstance, "getAllergies").returns(Result.ok<IAllergyDTO[]>([{ id: '123', designacao: 'Peanut', descricao: 'A common nut allergy' }]));

        const ctrl = new AllergyController(allergyServiceInstance as IAllergyService);

        // Act
        await ctrl.getAllergie(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match([{ id: '123', designacao: 'Peanut', descricao: 'A common nut allergy' }]));
    });

    /*it('should delete an allergy successfully', async function () {
        const req: Partial<Request> = { params: { id: '123' } };
        const res: Partial<Response> = { json: sinon.spy(), status: sinon.stub().returnsThis() };
        const next: Partial<NextFunction> = () => {};

        const allergyServiceInstance = Container.get("AllergyService");
        sinon.stub(allergyServiceInstance, "deleteAllergy").returns(Result.ok('Allergy deleted successfully'));

        const ctrl = new AllergyController(allergyServiceInstance as IAllergyService);

        // Act
        await ctrl.deleteAllergie(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, { message: 'Allergy deleted successfully' });
    });

    it('should handle allergy not found when deleting', async function () {
        const req: Partial<Request> = { params: { id: '123' } };
        const res: Partial<Response> = { json: sinon.spy(), status: sinon.stub().returnsThis() };
        const next: Partial<NextFunction> = () => {};

        const allergyServiceInstance = Container.get("AllergyService");
        sinon.stub(allergyServiceInstance, "deleteAllergy").returns(Result.fail('Allergy not found'));

        const ctrl = new AllergyController(allergyServiceInstance as IAllergyService);

        // Act
        await ctrl.deleteAllergy(<Request>req, <Response>res, <NextFunction>next);

        // Assert
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, { message: 'Allergy not found' });
    });*/

    it('should change allergy details successfully', async function () {
        const body = { designacao: 'Peanut', descricao: 'A common nut allergy' };
        const query = { designacao: 'Peanut' };
        const req: Partial<Request> = { body, query };
        const res: Partial<Response> = { json: sinon.spy(), status: sinon.stub().returnsThis() };
        const next: Partial<NextFunction> = () => {};
    
        const allergyServiceInstance = Container.get("AllergyService");
    
        sinon.stub(allergyServiceInstance, "updateAllergie").resolves(Result.ok<IAllergyDTO>({
            id: '123',
            designacao: body.designacao,
            descricao: body.descricao,
        }));
    
        const ctrl = new AllergyController(allergyServiceInstance as IAllergyService);
    
        // Act
        await ctrl.update(<Request>req, <Response>res, <NextFunction>next);
    
        // Assert
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, sinon.match({
            id: '123',
            designacao: body.designacao,
            descricao: body.descricao,
        }));
    });
    
});
