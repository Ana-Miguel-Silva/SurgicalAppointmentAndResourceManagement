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
        codigo: Joi.string().required(),
        descricao: Joi.string().required(),
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
        descricao: Joi.string(),
      }),
    }),
    (req, res, next) => ctrl.getMedicalCondition(req, res, next),
  );
};
