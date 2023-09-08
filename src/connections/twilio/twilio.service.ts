import { Injectable } from '@nestjs/common'
import { Twilio } from 'twilio/lib'
import customer from 'twilio'

@Injectable()
export class TwilioService {
  public customer: Twilio

  constructor() {
    this.customer = customer(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN, { lazyLoading: true })
  }
}
