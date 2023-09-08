import { Injectable } from '@nestjs/common';
import { CacheService } from '../../../connections/cache/cache.service';
import { cacheKeys } from '../../cache/cache-keys';
import { responseMessages } from '../../messages/response.messages';
import { TwilioService } from '../../../connections/twilio/twilio.service';
import {
  ValidateSmsCodeEnum,
  ValidateSmsCodeInput,
} from './dto/validate-sms-code.input';
import { isPhoneNumber } from 'class-validator';
import { MessageListInstance } from 'twilio/lib/rest/api/v2010/account/message';
import { CommonValidator } from '../../validator/common-validator';

@Injectable()
export class SmsService {
  twilioSms: MessageListInstance;
  constructor(
    private cache: CacheService,
    private twilioService: TwilioService,
  ) {
    this.twilioSms = this.twilioService.customer.messages;
  }

  async send(body: string, phone: string) {
    if (!isPhoneNumber(phone)) throw new Error(responseMessages.invalidPhone);

    return this.twilioSms.create({
      body,
      to: phone,
      from: process.env.PHONE_FROM,
      attempt: 3,
    });
  }

  async validateCode(input: ValidateSmsCodeInput) {
    const errors = await CommonValidator.simpleValidate(input);
    if (errors) return errors;

    const cacheKey = this.getCacheKeyForValidate(input.code, input.validateFor);
    const phone = await this.cache.get<string>(cacheKey);
    const valid = !!(phone && phone === input.phone);

    return { __typename: 'ValidResult', valid };
  }

  private getCacheKeyForValidate(code: string, key: ValidateSmsCodeEnum) {
    return {
      PRE_CREATE_USER: cacheKeys.sms.preCreate(code),
      LOGIN: cacheKeys.sms.login(code),
    }[key];
  }
}
