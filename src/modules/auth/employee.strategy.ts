import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Request } from 'express'

@Injectable()
export class EmployeeStrategy extends PassportStrategy(Strategy, 'employee') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passReqToCallback: true })
  }

  async validate(req: Request): Promise<any> {
    const { email, password } = req.body

    const employee = await this.authService.validateEmployee(email, password)
    if (!employee) {
      throw new UnauthorizedException()
    }
    return employee
  }
}
