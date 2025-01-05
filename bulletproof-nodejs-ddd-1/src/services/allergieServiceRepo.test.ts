import 'reflect-metadata';
import { expect } from 'chai';
import sinon from 'sinon';

import { Result } from '../../src/core/logic/Result';
import AllergieRepo from '../repos/allergieRepo';
import logger from '../loaders/logger';
import { AllergyStatus } from '../domain/allergieStatus';
import allergieSchema from '../persistence/schemas/allergieSchema';
import AllergieService from './allergieService';

describe('Allergie Service and Repo', () => {
  const sandbox = sinon.createSandbox();
  let allergieRepo: AllergieRepo;
  let allergieService: AllergieService;

  beforeEach(() => {
    allergieRepo = new AllergieRepo(allergieSchema, logger);
    allergieService = new AllergieService(allergieRepo);

    sandbox.stub(allergieRepo, 'save').resolves();
    
    sandbox.stub(allergieRepo, 'update').resolves();  
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should create an allergy successfully', function (done) {
    this.timeout(100000); 

    const mockInput = {
      id: '111111',
      designacao: 'Peanuts',
      descricao: 'Reaction to peanuts'
    };

    allergieService.createAllergie(mockInput)
      .then((result) => {
        expect(result.isSuccess).to.be.true;
        expect(result.getValue()).to.have.property('designacao', 'Peanuts');
        done(); 
      })
      .catch(done);   
    });


  it('should fail to create an allergy with invalid data', async () => {
    const mockInput = {
      id: '1',
      designacao: null,
      descricao: 'Reaction to peanuts'
    };

    const result = await allergieService.createAllergie(mockInput);

    expect(result.isSuccess).to.be.false;
    expect(result.errorValue()).equals("designacao is null or undefined");
  });

  
  
  it('should fail to update a non-existing allergy', function (done) {
    this.timeout(10000); 
  
    const mockInput = {
      id: null,
      designacao: 'Peanuts',
      descricao: 'Reaction to peanuts',
    };

    const findByDesignacao = sandbox.stub(allergieRepo, 'findByDesignacao').resolves(null);
  
    allergieService.updateAllergie(null, mockInput)
      .then((result) => {
        expect(result.isSuccess).to.be.false;
        expect(result.errorValue()).equal("Allergie with designacao null not found");
        done(); 
        findByDesignacao.restore();
      })
      .catch(done);
  });
 
});
