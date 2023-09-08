import { Injectable, Inject, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from '../../common/service.repository'
import { CreateCustomerInput } from './dto/create-customer.input'
import { Customer } from './entities/customer.entity'
import { Role } from '../../common/enums/role.enum'
import { AuthService } from '../auth/auth.service'
import { responseMessages } from '../../common/messages/response.messages'
import { ID } from '../../@types'
import { UpdateCustomerInput } from './dto/update-customer.input'

@Injectable()
export class CustomerService extends BaseService<Customer> {
  constructor(
    @InjectRepository(Customer)
    private readonly repo: Repository<Customer>,
    private authService: AuthService,
  ) {
    super(repo)
  }

  async create(dto: CreateCustomerInput) {
    await this.validateIfExists({
      key: 'email',
      value: dto.email,
      errorMessage: responseMessages.user.emailConflictError,
    })

    const hashedPassword = await this.authService.hashPassword(dto.password)

    return this.repo.save({
      ...dto,
      password: hashedPassword,
      role: Role.Customer,
    })
  }

  async findOne(id: ID) {
    return this.repo.findOne({ where: { id } })
  }

  async update(id: ID, input: UpdateCustomerInput) {
    return this.repository.update(id, input)
  }
}
