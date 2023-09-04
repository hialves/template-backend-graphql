import { Role } from '../enums/role.enum'

export interface IAccessToken {
  id: number
  email: string
  role: Role
}

declare global {
  namespace Express {
    export interface Request {
      requestId?: string
      user?: IAccessToken
    }
  }
}
