import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';

import config from "../../../config";
import { celebrate, Joi } from 'celebrate';
import winston = require('winston');
import AllergieService from '../../services/allergieService';
import IAllergieDTO from '../../dto/IAllergieDTO';
import IAllergieController from '../../controllers/IControllers/IAllergieController';


var allergie_controller = require('../../controllers/allergieController');
const route = Router();


export default (app: Router) => {
  
  app.use('/allergie', route);

  const ctrl = Container.get(config.controllers.allergie.name) as IAllergieController;

  route.post(
    '/create',
    celebrate({
      body: Joi.object({
        designacao: Joi.string().required(),
        descricao: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.createAllergie(req, res, next) );


    route.patch(
      '',
      celebrate({
        body: Joi.object({
          designacao: Joi.string(),
          descricao: Joi.string(),
        }),
      }),
      (req, res, next) => ctrl.update(req, res, next) );
    

  route.get(
    '/get',
    celebrate({
      body: Joi.object({
        id: Joi.string(),
        designacao: Joi.string(),
        descricao: Joi.string(),      
      }),
    }),
    (req, res, next) => ctrl.getAllergie(req, res, next) );

    route.get(
      '/getById',
      celebrate({
        body: Joi.object({
          id: Joi.string()         
        }),
      }),
      (req, res, next) => ctrl.getAllergieById(req, res, next) );
 
};
