import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Role } from '../../common/enums/role.enum'
import { Roles } from '../../decorators/roles.decorator'
import { AdminService } from './admin.service'
import { Admin } from './entities/admin.entity'
import { CreateAdminInput } from './dto/create-admin.input'
import { UpdateAdminInput } from './dto/update-admin.input'
import { ID } from '../../@types'
import { DeleteResult } from '../../common/graphql/types/result-type'

@Resolver(() => Admin)
export class AdminResolver {
  constructor(private readonly service: AdminService) {}

  @Roles(Role.SuperAdmin)
  @Mutation(() => Admin)
  create(@Args('input', { type: () => CreateAdminInput }) input: CreateAdminInput) {
    return this.service.create(input)
  }

  @Roles(Role.SuperAdmin)
  @Query(() => [Admin])
  admins() {
    return this.service.findAll({})
  }

  @Roles(Role.SuperAdmin)
  @Query(() => Admin)
  admin(@Args('id') id: ID) {
    return this.service.findOne(+id)
  }

  @Roles(Role.SuperAdmin, Role.Admin, Role.Manager)
  @Mutation(() => Admin)
  updateAdmin(@Args('input') input: UpdateAdminInput) {
    return this.service.update(input.id, input)
  }

  @Roles(Role.SuperAdmin)
  @Mutation(() => DeleteResult)
  removeAdmin(@Args('id') id: ID) {
    return this.service.remove(+id)
  }
}
