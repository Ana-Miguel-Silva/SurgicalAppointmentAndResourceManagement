import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";


import IMedicalConditionService from '../services/IServices/IMedicalConditionService';
import IMedicalConditionDTO from '../dto/IMedicalConditionDTO';

import { Result } from "../core/logic/Result";
import IMedicalConditionController from './IControllers/IMedicalConditionController';

@Service()
export default class MedicalConditionController implements IMedicalConditionController /* TODO: extends ../core/infra/BaseController */ {
  constructor(
      @Inject(config.services.medicalCondition.name) private medicalConditionServiceInstance : IMedicalConditionService
  ) {}

  public async createMedicalCondition(req: Request, res: Response, next: NextFunction) {
    try {
      const MedicalConditionOrError = await this.medicalConditionServiceInstance.createMedicalCondition(req.body as IMedicalConditionDTO) as Result<IMedicalConditionDTO>;
        
      if (MedicalConditionOrError.isFailure) {
        return res.status(402).send();
      }

      const MedicalConditionDTO = MedicalConditionOrError.getValue();
      return res.json( MedicalConditionDTO ).status(201);
    }
    catch (e) {
      return next(e);
    }
  };

  public async getMedicalCondition(req: Request, res: Response, next: NextFunction) {
    try {
      const MedicalConditionOrError = await this.medicalConditionServiceInstance.getMedicalCondition(req.body as string) as Result<IMedicalConditionDTO>;

      if (MedicalConditionOrError.isFailure) {
        return res.status(404).send();
      }

      const MedicalConditionDTO = MedicalConditionOrError.getValue();
      return res.status(201).json( MedicalConditionDTO );
    }
    catch (e) {
      return next(e);
    }
  };
}