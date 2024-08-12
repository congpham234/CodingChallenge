import { Router, Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { LogStreamHandler } from '../handlers/v1/log-stream-handler';

const logSearchHandler = container.resolve(LogStreamHandler);

const getLog = (router: Router): void => {
  router.get(
    '/v1/get-log',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const filename = req.query.filename as string;
        const numberOfEntries = parseInt(req.query.numberOfEntries as string) || 10;
        const keywordFilter = req.query.keywordFilter as string;
    
        if (!filename) {
          return res.status(400).json({ message: 'Filename is required' });
        }
    
        // Streaming logs in chunk
        logSearchHandler.streamLogs(res, filename, numberOfEntries, keywordFilter);
      } catch (error) {
        next(error);
      }
    },
  );
};

export default getLog;
