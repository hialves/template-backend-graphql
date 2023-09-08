import { Args, Query, Resolver } from '@nestjs/graphql'
import { InputPipe } from '../../pipes/input.pipe'
import { ValidateSmsCodeInput } from './dto/validate-sms-code.input'
import { SmsService } from './sms.service'
import { IsPublic } from '../../../decorators/public.decorator'

@Resolver()
export class SmsResolver {
  constructor(private readonly smsService: SmsService) {}

  @Query()
  @IsPublic()
  async validateSmsCode(@Args('input', InputPipe) input: ValidateSmsCodeInput) {
    return this.smsService.validateCode(input)
  }
}
