import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: any; // To be refined later with a proper User interface
}
