import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional } from 'class-validator'

@InputType()
export class CreateCustomerInput {
  @IsNotEmpty()
  @Field()
  name: string

  @IsNotEmpty()
  @Field()
  email: string

  @IsNotEmpty()
  @Field()
  password: string

  @IsOptional()
  @Field({ nullable: true })
  cardToken?: string

  @IsOptional()
  @Field({ nullable: true })
  phone?: string
}
