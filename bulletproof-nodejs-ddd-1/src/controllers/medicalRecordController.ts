import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";


import IMedicalRecordService from '../services/IServices/IMedicalRecordService';
import IMedicalRecordDTO from '../dto/IMedicalRecordDTO';

import { Result } from "../core/logic/Result";
import IMedicalRecordController from './IControllers/IMedicalRecordController';
import AllergieService from '../services/allergieService';
import IAllergieService from '../services/IServices/IAllergieService';
import IFEMedicalRecordDTO from '../dto/IFEMedicalRecordDTO';
import IMedicalConditionService from '../services/IServices/IMedicalConditionService';
import { MedicalCondition } from '../domain/medicalCondition';


@Service()
export default class MedicalRecordController implements IMedicalRecordController /* TODO: extends ../core/infra/BaseController */ {
  constructor(
      @Inject(config.services.medicalRecord.name) private medicalRecordServiceInstance : IMedicalRecordService,
  ) {}


  public async getMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const MedicalRecordOrError = await this.medicalRecordServiceInstance.getMedicalRecord(req.body as string) as Result<IFEMedicalRecordDTO>;

      console.log("get medical record" , MedicalRecordOrError);

      if (MedicalRecordOrError.isFailure) {
        return res.status(404).send();
      }

      const MedicalRecordDTO = MedicalRecordOrError.getValue();   
      console.log("get medical record2 "  , MedicalRecordDTO);

      return res.status(200).json( MedicalRecordDTO );
    }
    catch (e) {
      return next(e);
    }
  };



  public async createMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const MedicalRecordOrError = await this.medicalRecordServiceInstance.createMedicalRecord(req.body as IMedicalRecordDTO) as Result<IMedicalRecordDTO>;

      console.log("body create: ", req.body)

      console.log("Create medical record: ", MedicalRecordOrError);

      console.log(MedicalRecordOrError);

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

  public async updateMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const MedicalRecordOrError = await this.medicalRecordServiceInstance.updateMedicalRecord(req.body as IMedicalRecordDTO) as Result<IMedicalRecordDTO>;

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


  public async deleteMedicalRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const MedicalRecordOrError = await this.medicalRecordServiceInstance.deleteMedicalRecord(req.body as string) as Result<string>;
      console.log(MedicalRecordOrError);

      if (MedicalRecordOrError.isSuccess) {        
        return res.status(200).send();
      }

      return res.status(404).send();
    }
    catch (e) {
      return next(e);
    }
  };

  public async getMedicalRecordById(req: Request, res: Response, next: NextFunction) {
    try {
      const MedicalRecordOrError = await this.medicalRecordServiceInstance.getMedicalRecord(req.body as string) as Result<IFEMedicalRecordDTO>;

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
