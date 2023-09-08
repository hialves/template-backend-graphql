import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { responseMessages } from '../../../messages/response.messages';

export enum ValidateSmsCodeEnum {
  PRE_CREATE_USER = 'PRE_CREATE_USER',
  LOGIN = 'LOGIN',
}

export class ValidateSmsCodeInput {
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber(undefined, {
    message: responseMessages.invalidPhone,
  })
  phone: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  validateFor: ValidateSmsCodeEnum;
}
