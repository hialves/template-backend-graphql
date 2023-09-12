import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsEmailNotRegistered } from '../../../common/validator/is-email-registered.validator';
import { responseMessages } from '../../../common/messages/response.messages';

@InputType()
export class CreateAdminInput {
  @IsNotEmpty()
  @Field()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @IsEmailNotRegistered()
  @Field()
  email: string;

  @IsNotEmpty()
  @Field()
  password: string;
}
