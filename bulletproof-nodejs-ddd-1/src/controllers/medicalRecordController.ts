import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";


import IMedicalRecordService from '../services/IServices/IMedicalRecordService';
import IMedicalRecordDTO from '../dto/IMedicalRecordDTO';

import { Result } from "../core/logic/Result";
import IMedicalRecordController from './IControllers/IMedicalRecordController';

@Service()
export default class MedicalRecordController implements IMedicalRecordController /* TODO: extends ../core/infra/BaseController */ {
  constructor(
      @Inject(config.services.medicalRecord.name) private medicalRecordServiceInstance : IMedicalRecordService
  ) {} 

  public async getMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const MedicalRecordOrError = await this.medicalRecordServiceInstance.getMedicalRecord(req.body as string) as Result<IMedicalRecordDTO>;

      if (MedicalRecordOrError.isFailure) {
        return res.status(404).send();
      }

      const MedicalRecordDTO = MedicalRecordOrError.getValue();
      return res.status(201).json( MedicalRecordDTO );
    }
    catch (e) {
      return next(e);
    }
  };
  

  public async createMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const MedicalRecordOrError = await this.medicalRecordServiceInstance.createMedicalRecord(req.body as IMedicalRecordDTO) as Result<IMedicalRecordDTO>;
        
      if (MedicalRecordOrError.isFailure) {
        return res.status(402).send();
      }

      const MedicalRecordDTO = MedicalRecordOrError.getValue();
      return res.json( MedicalRecordDTO ).status(201);
    }
    catch (e) {
      return next(e);
    }
  };

  public async getMedicalRecordById(req: Request, res: Response, next: NextFunction) {
    try {
      const MedicalRecordOrError = await this.medicalRecordServiceInstance.getMedicalRecord(req.body as string) as Result<IMedicalRecordDTO>;

      if (MedicalRecordOrError.isFailure) {
        return res.status(404).send();
      }

      const MedicalRecordDTO = MedicalRecordOrError.getValue();
      return res.status(201).json( MedicalRecordDTO );
    }
    catch (e) {
      return next(e);
    }
  };
}