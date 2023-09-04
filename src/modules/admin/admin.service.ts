import { Injectable, forwardRef, Inject } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { BaseService } from '../../common/service.repository'
import { CreateAdminDto } from './dto/create-admin.dto'
import { Admin } from './entities/admin.entity'
import { Role } from '../../enums/role.enum'
import { AuthService } from '../auth/auth.service'

@Injectable()
export class AdminService extends BaseService<Admin> {
  constructor(
    @InjectRepository(Admin)
    private readonly repo: Repository<Admin>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {
    super(repo)
  }

  async create(dto: CreateAdminDto) {
    await this.validateIfExists({
      key: 'email',
      value: dto.email,
      errorMessage: 'Email já cadastrado',
    })

    const hashedPassword = await this.authService.hashPassword(dto.password)

    return this.repo.save({
      ...dto,
      password: hashedPassword,
      role: Role.SuperAdmin,
    })
  }

  getCredentials(email: string) {
    return this.repo.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    })
  }
}
