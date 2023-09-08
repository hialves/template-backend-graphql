import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @Field()
  password: string;

  @IsOptional()
  @Field({ nullable: true })
  device?: string;
}
