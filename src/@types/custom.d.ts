import { Role } from '../common/enums/role.enum';
import { IUserSession } from '../common/interfaces/session.interface';

declare global {
  namespace Express {
    export interface Request {
      requestId?: string;
      user?: IUserSession;
    }
  }
}
