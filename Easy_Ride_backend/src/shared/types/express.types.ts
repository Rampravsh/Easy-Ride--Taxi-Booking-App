import { Request } from 'express';
import { IUser } from '../../modules/user/user.model';

export interface AuthRequest extends Request {
  user?: IUser;
}
