import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import Config from './config';

const app = express();
const config = Config.getInstance();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Serve uploaded images statically
app.use('/uploads', express.static(path.resolve(config.uploadDir)));

// API Routes
app.use('/api', routes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

export default app;
