import express from 'express';
import setupRoutes from './routes';
import { errorHandler } from '../common/middlewares/error-handler-middleware';

const app = express();
app.use(express.json());
setupRoutes(app);
app.use(errorHandler);

export default app;
