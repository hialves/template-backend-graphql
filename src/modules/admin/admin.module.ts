import { Module, forwardRef } from '@nestjs/common'
import { AdminService } from './admin.service'
import { AdminController } from './admin.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Admin } from './entities/admin.entity'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), forwardRef(() => AuthModule)],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
