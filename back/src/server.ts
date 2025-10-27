// src/server.ts
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';
import 'reflect-metadata';

import { router } from './presentation/routes';
import { errorHandler } from './presentation/middleware/errorHandler';
import { logger } from './shared/utils/logger';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Muitas requisições deste IP, tente novamente em 15 minutos.'
});
app.use(limiter);

app.use('/api', router);

app.use(errorHandler);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  logger.info(`🚀 Servidor rodando na porta ${PORT}`);
  logger.info(`📱 API disponível em: http://localhost:${PORT}/api`);
}).on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    logger.warn(`❌ Porta ${PORT} está em uso. Tentando porta ${Number(PORT) + 1}...`);
    app.listen(Number(PORT) + 1, () => {
      logger.info(`�� Servidor rodando na porta ${Number(PORT) + 1}`);
    });
  } else {
    logger.error('❌ Erro ao iniciar servidor:', err);
  }
});