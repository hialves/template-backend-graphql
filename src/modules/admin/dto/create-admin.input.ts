import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'

@InputType()
export class CreateAdminInput {
  @IsNotEmpty()
  @Field()
  name: string

  @IsNotEmpty()
  @Field()
  email: string

  @IsNotEmpty()
  @Field()
  password: string
}
