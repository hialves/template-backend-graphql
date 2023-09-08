import { PartialType } from '@nestjs/graphql'
import { CreateAdminInput } from './create-admin.input'
import { ID } from '../../../@types'
import { IsNotEmpty } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UpdateAdminInput extends PartialType(CreateAdminInput) {
  @IsNotEmpty()
  @Field()
  id: ID
}
