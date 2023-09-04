import { Injectable, Inject, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BaseService } from '../../common/service.repository'
import { CreateClientDto } from './dto/create-client.dto'
import { Client } from './entities/client.entity'
import { Role } from '../../enums/role.enum'
import { AuthService } from '../auth/auth.service'

@Injectable()
export class ClientService extends BaseService<Client> {
  constructor(
    @InjectRepository(Client)
    private readonly repo: Repository<Client>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {
    super(repo)
  }

  async create(dto: CreateClientDto) {
    await this.validateIfExists({
      key: 'email',
      value: dto.email,
      errorMessage: 'Email já cadastrado',
    })

    const hashedPassword = await this.authService.hashPassword(dto.password)

    return this.repo.save({
      ...dto,
      password: hashedPassword,
      role: Role.Client,
    })
  }

  async findOne(id: number) {
    return this.repo.findOne({ where: { id } })
  }

  getCredentials(email: string) {
    return this.repo.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    })
  }
}
