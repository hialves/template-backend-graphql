import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { CacheModule } from '../../../connections/cache/cache.module';
import { TwilioModule } from '../../../connections/twilio/twilio.module';

@Module({
  imports: [CacheModule, TwilioModule],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
