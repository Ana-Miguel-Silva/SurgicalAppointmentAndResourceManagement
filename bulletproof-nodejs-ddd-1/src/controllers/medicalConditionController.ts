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
      console.log(MedicalConditionOrError);
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

  public async getMedicalConditionById(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.params.medicalConditionId as string);
      const MedicalConditionOrError = await this.medicalConditionServiceInstance.getMedicalConditionById(req.params.medicalConditionId as string) as Result<IMedicalConditionDTO>;
      console.log(MedicalConditionOrError);
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

  public async updateMedicalConditionById(req: Request, res: Response, next: NextFunction) {
    try {
      const medicalConditionId = req.params.medicalConditionId as string;
      console.log(req.params.medicalConditionId as string);
      const updateData = req.body;
      console.log("AAAAAAAAAAAAAAAABBBBBBBBBBBBBBBB",updateData);
      
      const updateResult = await this.medicalConditionServiceInstance.updateMedicalConditionById(
        medicalConditionId,
        updateData
      ) as Result<IMedicalConditionDTO>;

      console.log(updateResult);
      if (updateResult.isFailure) {
        return res.status(404).json({ error: "Medical condition not found or update failed." });
      }

      const updatedMedicalConditionDTO = updateResult.getValue();
      return res.status(200).json(updatedMedicalConditionDTO);
    }
    catch (e) {
      return next(e);
    }
  };
}