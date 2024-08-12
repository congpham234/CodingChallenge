import { Router } from 'express';
import getLog from './routes/get-log';

const createRouter = (): Router => {
  const router = Router();
  getLog(router);
  return router;
};

export default createRouter;
