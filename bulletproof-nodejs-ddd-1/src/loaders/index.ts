import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';

import config from '../../config';
import allergieSchema from '../persistence/schemas/allergieSchema';
import { bootstrapAllergies } from './bootstrapAllergies';
import { bootstrapMedicalConditions } from './bootstrapMedicalConditions';
import { bootstrapMedicalRecords } from './bootstrapMedicalRecord';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  const userSchema = {
    // compare with the approach followed in repos and services
    name: 'userSchema',
    schema: '../persistence/schemas/userSchema',
  };

  const allergieSchema = {
    // compare with the approach followed in repos and services
    name: 'allergieSchema',
    schema: '../persistence/schemas/allergieSchema',
  };

  const medicalRecordSchema = {
    // compare with the approach followed in repos and services
    name: 'medicalRecordSchema',
    schema: '../persistence/schemas/medicalRecordSchema',
  };

  const medicalConditionSchema = {
    // compare with the approach followed in repos and services
    name: 'medicalConditionSchema',
    schema: '../persistence/schemas/medicalConditionSchema',
  };

  const roleSchema = {
    // compare with the approach followed in repos and services
    name: 'roleSchema',
    schema: '../persistence/schemas/roleSchema',
  };

  const roleController = {
    name: config.controllers.role.name,
    path: config.controllers.role.path
  }

  const allergieController = {
    name: config.controllers.allergie.name,
    path: config.controllers.allergie.path
  }

  const medicalConditionController = {
    name: config.controllers.medicalCondtion.name,
    path: config.controllers.medicalCondtion.path
  }

  const medicalRecordController = {
    name: config.controllers.medicalRecord.name,
    path: config.controllers.medicalRecord.path
  }

  const roleRepo = {
    name: config.repos.role.name,
    path: config.repos.role.path
  }

  const userRepo = {
    name: config.repos.user.name,
    path: config.repos.user.path
  }

  const allergieRepo = {
    name: config.repos.allergie.name,
    path: config.repos.allergie.path
  }

  const medicalConditionRepo = {
    name: config.repos.medicalCondtion.name,
    path: config.repos.medicalCondtion.path
  }

  const medicalRecordRepo = {
    name: config.repos.medicalRecord.name,
    path: config.repos.medicalRecord.path
  }

  const roleService = {
    name: config.services.role.name,
    path: config.services.role.path
  }

  const allergieService = {
    name: config.services.allergie.name,
    path: config.services.allergie.path
  }

  const medicalConditionService = {
    name: config.services.medicalCondition.name,
    path: config.services.medicalCondition.path
  }

  const medicalRecordService = {
    name: config.services.medicalRecord.name,
    path: config.services.medicalRecord.path
  }

  await dependencyInjectorLoader({
    mongoConnection,
    schemas: [
      userSchema,
      roleSchema,
      allergieSchema,
      medicalRecordSchema,
      medicalConditionSchema
    ],
    controllers: [
      roleController,
      allergieController,
      medicalConditionController,
      medicalRecordController
    ],
    repos: [
      roleRepo,
      userRepo,
      allergieRepo,
      medicalConditionRepo,
      medicalRecordRepo
    ],
    services: [
      roleService,
      allergieService,
      medicalConditionService,
      medicalRecordService
    ]
  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  await bootstrapAllergies();
  await bootstrapMedicalConditions();
  await bootstrapMedicalRecords();

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
