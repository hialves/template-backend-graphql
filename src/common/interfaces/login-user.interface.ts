import { ID } from '../../@types';
import { Role } from '../enums/role.enum';

export interface ILoginUser {
  id: ID;
  email: string;
  password?: string;
  role?: Role;
}
