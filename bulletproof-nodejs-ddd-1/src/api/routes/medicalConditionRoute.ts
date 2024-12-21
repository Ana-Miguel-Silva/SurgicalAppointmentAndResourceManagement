import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';

import config from '../../../config';
import { celebrate, Joi } from 'celebrate';
import winston = require('winston');

import IMedicalConditionController from '../../controllers/IControllers/IMedicalConditionController';

const route = Router();

export default (app: Router) => {
  app.use('/medicalCondition', route);

  const ctrl = Container.get(config.controllers.medicalCondtion.name) as IMedicalConditionController;

  route.post(
    '/create',
    celebrate({
      body: Joi.object({
        codigo: Joi.string(),
        designacao: Joi.string(),
        descricao: Joi.string(),
        sintomas: Joi.array().items(Joi.string()),
      }),
    }),
    (req, res, next) => ctrl.createMedicalCondition(req, res, next),
  );

  route.get(
    '/get',
    celebrate({
      body: Joi.object({
        id: Joi.string(),
        codigo: Joi.string(),
        designacao: Joi.string(),
        descricao: Joi.string(),
        sintomas: Joi.array().items(Joi.string()),
      }),
    }),
    (req, res, next) => ctrl.getMedicalCondition(req, res, next),
  );

  route.get(
    '/get/:medicalConditionId',
    celebrate({
      params: Joi.object({
        medicalConditionId: Joi.string().required(), 
      }),
    }),
    (req, res, next) => ctrl.getMedicalConditionById(req, res, next),
  );

  route.patch(
    '/update/:medicalConditionId',
    celebrate({
      params: Joi.object({
        medicalConditionId: Joi.string().required(), 
      }),
      body: Joi.object({
        designacao: Joi.string(),
        descricao: Joi.string(),
        sintomas: Joi.array().items(Joi.string()),
      }),
    }),
    (req, res, next) => ctrl.updateMedicalConditionById(req, res, next),
  );
};
