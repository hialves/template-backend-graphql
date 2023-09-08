import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Session } from './entities/session.entity';
import { CacheModule } from '../../connections/cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Session, User]), CacheModule],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
