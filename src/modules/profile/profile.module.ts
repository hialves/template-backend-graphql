import { Module } from '@nestjs/common';
import { ProfileResolver } from './profile.resolver';
import { EmailNotRegistered } from '../../common/validator/is-email-registered.validator';
import { AdminModule } from '../admin/admin.module';
import { CustomerModule } from '../customer/customer.module';
import { UserModule } from '../user/user.module';
import { ProfileService } from './profile.service';

@Module({
  imports: [UserModule, AdminModule, CustomerModule],
  providers: [ProfileResolver, ProfileService, EmailNotRegistered],
  exports: [ProfileService],
})
export class ProfileModule {}
