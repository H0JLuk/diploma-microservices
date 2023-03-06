import { Request } from 'express';

import { JwtUser } from '../entities';

export interface AppRequest extends Request {
  user?: JwtUser['user'];
}
