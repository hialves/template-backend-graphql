import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from '../../common/service.repository'
import { CreateAdminInput } from './dto/create-admin.input'
import { Admin } from './entities/admin.entity'
import { Role } from '../../common/enums/role.enum'
import { AuthService } from '../auth/auth.service'
import { responseMessages } from '../../common/messages/response.messages'
import { ID } from '../../@types'
import { UpdateCustomerInput } from '../customer/dto/update-customer.input'

@Injectable()
export class AdminService extends BaseService<Admin> {
  constructor(
    @InjectRepository(Admin)
    private readonly repo: Repository<Admin>,
    private authService: AuthService,
  ) {
    super(repo)
  }

  async create(input: CreateAdminInput) {
    await this.validateIfExists({
      key: 'email',
      value: input.email,
      errorMessage: responseMessages.user.emailConflictError,
    })

    const hashedPassword = await this.authService.hashPassword(input.password)

    return this.repo.save({
      ...input,
      password: hashedPassword,
      role: Role.SuperAdmin,
    })
  }

  async update(id: ID, input: UpdateCustomerInput) {
    return this.repository.update(id, input)
  }
}
