import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';

import config from "../../../config";
import { celebrate, Joi } from 'celebrate';
import winston = require('winston');

import IMedicalRecordController from '../../controllers/IControllers/IMedicalRecordController';


const route = Router();


export default (app: Router) => {

  app.use('/medicalRecord', route);

  const ctrl = Container.get(config.controllers.medicalRecord.name) as IMedicalRecordController;

  route.post(
    '/create',
    celebrate({
      body: Joi.object({
        staff: Joi.string(),
        patientId: Joi.string(),
        allergies: Joi.array().items(Joi.string()).required(),
        medicalConditions: Joi.array().items(Joi.string()).required(),
        descricao: Joi.string().allow('').optional(),
      }),
    }),
    (req, res, next) => ctrl.createMedicalRecord(req, res, next) );

    route.patch(
      '/update',
      celebrate({
        body: Joi.object({    
          patientId: Joi.string().required(),    
          allergies: Joi.array().items(Joi.string()),
          medicalConditions: Joi.array().items(Joi.string()),
          descricao: Joi.string().allow('').optional(),
        }),
      }),
      (req, res, next) => ctrl.updateMedicalRecord(req, res, next) );


  route.get(
    '/get',
    celebrate({
      body: Joi.object({
        id: Joi.string(),
        staff: Joi.string(),
        patientId: Joi.string(),
        allergies: Joi.array().items(Joi.string()).required(),
        medicalConditions: Joi.array().items(Joi.string()).required(),
        descricao: Joi.string(),
      }),
    }),
    (req, res, next) => ctrl.getMedicalRecord(req, res, next) );

    route.get(
      '/getById',
      celebrate({
        body: Joi.object({
          id: Joi.string()
        }),
      }),
      (req, res, next) => ctrl.getMedicalRecordById(req, res, next) );

};
