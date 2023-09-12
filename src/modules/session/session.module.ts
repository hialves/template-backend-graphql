import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { CacheModule } from '../../connections/cache/cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Session]), CacheModule],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
