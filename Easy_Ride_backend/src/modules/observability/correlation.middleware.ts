import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const correlationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const correlationId = req.header('x-correlation-id') || uuidv4();
  
  // Set in request for internal use
  req.headers['x-correlation-id'] = correlationId;
  
  // Set in response for client/monitoring
  res.setHeader('x-correlation-id', correlationId);
  
  next();
};
