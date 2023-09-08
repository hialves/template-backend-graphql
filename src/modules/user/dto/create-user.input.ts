import { InputType, Field } from '@nestjs/graphql'
import { Role } from '../../../common/enums/role.enum'

@InputType()
export class CreateUserInput {
  @Field()
  email: string

  @Field()
  password: string

  @Field(() => Role)
  role: Role
}
