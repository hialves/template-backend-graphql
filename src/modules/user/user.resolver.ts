import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { UserService } from './user.service'
import { User } from './entities/user.entity'
import { CreateUserInput } from './dto/create-user.input'
import { Roles } from '../../decorators/roles.decorator'
import { Role } from '../../common/enums/role.enum'
import { IsPublic } from '../../decorators/public.decorator'

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  @Roles(Role.SuperAdmin)
  createUser(@Args('input') input: CreateUserInput) {
    return this.userService.create(input)
  }

  @Query(() => [User])
  @IsPublic()
  users() {
    return this.userService.findAll()
  }

  @Query(() => User)
  @IsPublic()
  user(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findOne(id)
  }

  @Mutation(() => User)
  @Roles(Role.SuperAdmin)
  deleteUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.delete(id)
  }
}
