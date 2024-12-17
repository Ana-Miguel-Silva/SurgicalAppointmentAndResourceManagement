import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";


import IAllergieService from '../services/IServices/IAllergieService';
import IAllergieDTO from '../dto/IAllergieDTO';

import { Result } from "../core/logic/Result";
import IAllergieController from './IControllers/IAllergieController';

@Service()
export default class AllergieController implements IAllergieController /* TODO: extends ../core/infra/BaseController */ {
  constructor(
      @Inject(config.services.allergie.name) private allergieServiceInstance : IAllergieService,
  ) {}
  

  public async createAllergie(req: Request, res: Response, next: NextFunction) {
    try {
      const AllergieOrError = await this.allergieServiceInstance.createAllergie(req.body as IAllergieDTO) as Result<IAllergieDTO>;
        
      if (AllergieOrError.isFailure) {
        return res.status(402).send();
      }

      const AllergieDTO = AllergieOrError.getValue();
      return res.json( AllergieDTO ).status(201);
    }
    catch (e) {
      return next(e);
    }
  };

  public async getAllergieById(req: Request, res: Response, next: NextFunction) {
    try {
      const AllergieOrError = await this.allergieServiceInstance.getAllergieById(req.body as string) as Result<IAllergieDTO>;

      if (AllergieOrError.isFailure) {
        return res.status(404).send();
      }

      const AllergieDTO = AllergieOrError.getValue();
      return res.status(200).json( AllergieDTO );
    }
    catch (e) {
      return next(e);
    }
  };

  public async update(req: Request, res: Response, next: NextFunction) {
    try {

      const allergieId = req.query.designacao as string;

      if (!allergieId) {
        return res.status(400).json({ error: "Designacao is required in the URL." });
      }

      const allergieUpdateData = req.body as Partial<IAllergieDTO>; 
  
      
      const AllergieOrError = await this.allergieServiceInstance.updateAllergie(allergieId, allergieUpdateData) as Result<IAllergieDTO>;
  
      if (AllergieOrError.isFailure) {
        return res.status(404).json({ error: AllergieOrError.errorValue() });
      }
  
      const AllergieDTO = AllergieOrError.getValue();
  
      return res.status(200).json(AllergieDTO);
    } catch (e) {
      next(e); 
    }
  }

  public async getAllergyByDesignacao(req: Request, res: Response): Promise<Response> {
    try {
      const designacao  = req.query.designacao;

      if (!designacao || typeof designacao !== 'string') {
        return res.status(400).json({ error: 'Designação é obrigatória na URL.' });
      }

      console.log("OLA123")


      // Chama o serviço passando a designação
      const allergy = await this.allergieServiceInstance.getAllergyByDesignacao(designacao);

      console.log("OLA234")

      if (!allergy) {
        return res.status(404).json({ error: 'Alergia não encontrada.' });
      }

      return res.json(allergy);

    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar alergia.' });
    }
  }


  public async getAllergie(req: Request, res: Response, next: NextFunction) {
    try {
      const AllergieOrError = await this.allergieServiceInstance.getAllergies(req.body as string) as Result<IAllergieDTO>;

      if (AllergieOrError.isFailure) {
        return res.status(404).send();
      }

      const AllergieDTO = AllergieOrError.getValue();
      return res.status(201).json( AllergieDTO );
    }
    catch (e) {
      return next(e);
    }
  };
}