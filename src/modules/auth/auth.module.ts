import { Module, forwardRef } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AdminModule } from '../admin/admin.module'
import { ClientModule } from '../client/client.module'
import { EmployeeModule } from '../employee/employee.module'
import { AdminStrategy } from './admin.strategy'
import { AuthService } from './auth.service'
import { ClientStrategy } from './client.strategy'
import { EmployeeStrategy } from './employee.strategy'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    forwardRef(() => AdminModule),
    // AdminModule,
    ClientModule,
    EmployeeModule,

    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '365d' },
    }),
  ],
  providers: [AuthService, ClientStrategy, EmployeeStrategy, JwtStrategy, AdminStrategy],
  exports: [AuthService],
})
export class AuthModule {}
