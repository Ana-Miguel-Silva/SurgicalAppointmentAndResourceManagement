import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port : optional change to 4000 by JRT
   */
  port: parseInt(process.env.PORT, 10) || 4000, 

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI || "mongodb+srv://admin:Password0@surgerycluster.blkwz.mongodb.net/",

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET || "SurgicalAppointmentResourceManagementIsepIppPt2024",
  jwtIssuer: "Heath App",
  jwtAudience: "UsersAPI",  

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  controllers: {
    role: {
      name: "RoleController",
      path: "../controllers/roleController"
    },
    allergie: {
      name: "AllergieController",
      path: "../controllers/allergieController"
    },
    medicalRecord: {
      name: "MedicalRecordController",
      path: "../controllers/medicalRecordController"
    },
    medicalCondtion: {
      name: "MedicalCondiitionController",
      path: "../controllers/medicalConditionController"
    }
  },

  repos: {
    role: {
      name: "RoleRepo",
      path: "../repos/roleRepo"
    },
    user: {
      name: "UserRepo",
      path: "../repos/userRepo"
    },
    allergie: {
      name: "AllergieRepo",
      path: "../repos/allergieRepo"
    },
    medicalRecord: {
      name: "MedicalRecordRepo",
      path: "../repos/medicalRecordRepo"
    },
    medicalCondtion: {
      name: "MedicalConditionRepo",
      path: "../repos/medicalConditionRepo"
    }
  },

  services: {
    role: {
      name: "RoleService",
      path: "../services/roleService"
    }, 
    allergie: {
      name: "AllergieService",
      path: "../services/allergieService"
    },
    medicalRecord: {
      name: "MedicalRecordService",
      path: "../services/medicalRecordService"
    },
    medicalCondition: {
      name: "MedicalConditionService",
      path: "../services/medicalConditionService"
    }
  },
};
