import { PartialType } from '@nestjs/graphql'
import { CreateCustomerInput } from './create-customer.input'
import { ID } from '../../../@types'
import { IsNotEmpty } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UpdateCustomerInput extends PartialType(CreateCustomerInput) {
  @IsNotEmpty()
  @Field()
  id: ID
}
