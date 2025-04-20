import express from 'express';
import setupRoutes from './routes';
import { errorHandler } from '../common/middlewares/error-handler-middleware';
import { checkAuth } from '../common/middlewares/check-auth-middleware';

const app = express();
app.use(express.json());
app.use(checkAuth);
setupRoutes(app);
app.use(errorHandler);

export default app;
