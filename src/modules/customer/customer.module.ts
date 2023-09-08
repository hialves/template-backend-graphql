import { Module } from '@nestjs/common'
import { CustomerService } from './customer.service'
import { Customer } from './entities/customer.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '../auth/auth.module'
import { CustomerResolver } from './customer.resolver'

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), AuthModule],
  providers: [CustomerService, CustomerResolver],
  exports: [CustomerService],
})
export class CustomerModule {}
