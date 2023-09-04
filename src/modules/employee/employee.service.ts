import { Injectable, Inject, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Repository } from 'typeorm'
import { BaseService } from '../../common/service.repository'
import { CreateEmployeeDto } from './dto/create-employee.dto'
import { Employee } from './entities/employee.entity'
import { AuthService } from '../auth/auth.service'

@Injectable()
export class EmployeeService extends BaseService<Employee> {
  constructor(
    @InjectRepository(Employee)
    private readonly repo: Repository<Employee>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {
    super(repo)
  }

  async create(dto: CreateEmployeeDto, t?: EntityManager) {
    await this.validateIfExists({
      key: 'email',
      value: dto.email,
      errorMessage: 'Email já cadastrado',
    })
    const hashedPassword = await this.authService.hashPassword(dto.password)

    const employee = new Employee()
    employee.email = dto.email
    employee.name = dto.name
    employee.password = hashedPassword

    return t ? t.save(employee) : this.repo.save(employee)
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
