import { Request, Response, NextFunction } from 'express';

export default interface IMedicalRecordController  {
  createMedicalRecord(req: Request, res: Response, next: NextFunction);
  getMedicalRecordById(req: Request, res: Response, next: NextFunction);
  getMedicalRecord(req: Request, res: Response, next: NextFunction);
  
}