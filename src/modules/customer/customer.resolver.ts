import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { IsPublic } from '../../decorators/public.decorator'
import { CreateCustomerInput } from './dto/create-customer.input'
import { CustomerService } from './customer.service'
import { Role } from '../../common/enums/role.enum'
import { Roles } from '../../decorators/roles.decorator'
import { ID } from '../../@types'
import { UpdateCustomerInput } from './dto/update-customer.input'
import { Customer } from './entities/customer.entity'
import { DeleteResult } from '../../common/graphql/types/result-type'

@Resolver()
export class CustomerResolver {
  constructor(private readonly service: CustomerService) {}

  @IsPublic()
  @Mutation(() => Customer)
  createCustomer(@Args({ name: 'input', type: () => CreateCustomerInput }) input: CreateCustomerInput) {
    return this.service.create(input)
  }

  @Roles(Role.SuperAdmin)
  @Query(() => [Customer])
  customers() {
    return this.service.findAll({})
  }

  @Roles(Role.SuperAdmin, Role.Manager, Role.Customer)
  @Query(() => Customer)
  customer(@Args('id') id: ID) {
    return this.service.findOne(id)
  }

  @Roles(Role.SuperAdmin, Role.Customer)
  @Mutation(() => Customer)
  updateCustomer(@Args('input') input: UpdateCustomerInput) {
    return this.service.update(input.id, input)
  }

  @Roles(Role.SuperAdmin)
  @Mutation(() => DeleteResult)
  removeCustomer(@Args('id') id: ID) {
    return this.service.remove(id)
  }
}
