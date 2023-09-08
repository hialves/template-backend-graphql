import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { AuthModule } from '../auth/auth.module';
import { AdminResolver } from './admin.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), AuthModule],
  providers: [AdminService, AdminResolver],
  exports: [AdminService],
})
export class AdminModule {}
