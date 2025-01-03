import { Request, Response, NextFunction } from 'express';

export default interface IMedicalConditionController  {
  createMedicalCondition(req: Request, res: Response, next: NextFunction);
  getMedicalCondition(req: Request, res: Response, next: NextFunction);
  getMedicalConditionById(req: Request, res: Response, next: NextFunction);
  updateMedicalConditionById(req: Request, res: Response, next: NextFunction);
}