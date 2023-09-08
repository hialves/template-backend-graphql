import { Session } from '../../modules/session/entities/session.entity';

export interface IUserSession extends Pick<Session, 'id' | 'token' | 'expiresAt' | 'valid'> {}
