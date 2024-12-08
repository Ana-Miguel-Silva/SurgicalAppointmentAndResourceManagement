import { Request, Response, NextFunction } from 'express';

export default interface IAllergieController  {
  createAllergie(req: Request, res: Response, next: NextFunction);
  getAllergieById(req: Request, res: Response, next: NextFunction);
  getAllergie(req: Request, res: Response, next: NextFunction);
}