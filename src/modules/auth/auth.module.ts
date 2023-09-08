import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { SessionModule } from '../session/session.module';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [UserModule, SessionModule],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
