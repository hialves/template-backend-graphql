import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { CacheModule } from '../../../connections/cache/cache.module';
import { TwilioModule } from '../../../connections/twilio/twilio.module';
import { SmsResolver } from './sms.resolver';

@Module({
  imports: [CacheModule, TwilioModule],
  providers: [SmsService, SmsResolver],
  exports: [SmsService],
})
export class SmsModule {}
