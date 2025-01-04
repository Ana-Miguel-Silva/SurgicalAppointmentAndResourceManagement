import 'reflect-metadata'; // We need this in order to use @Decorators
import config from '../config';
import express from 'express';
import cors from 'cors'; // Importar o pacote cors
import Logger from './loaders/logger';

async function startServer() {
  const app = express();

  // Configuração de CORS
  app.use(cors({
    origin: function (origin, callback) {
      // Permitindo tanto o IP da VM quanto o localhost (em qualquer porta)
      if (origin === 'http://localhost:4200' || origin === 'http://20.82.142.194:4200' || origin === 'http://51.120.112.94:4200' || !origin) {
        callback(null, true); // Permite o acesso de localhost e do IP da VM
      } else {
        callback(new Error('Not allowed by CORS'), false); // Outros domínios não são permitidos
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
  }));

  await require('./loaders').default({ expressApp: app });

  app.listen(config.port, () => {
    console.log("Server listening on port: " + config.port);
    Logger.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️ 
      ################################################
    `);
  })
  .on('error', (err) => {      
    Logger.error(err);
    process.exit(1);
    return;
  });
}

startServer();
