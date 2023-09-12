import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { BaseService } from '../../common/service.repository';
import { CreateAdminInput } from './dto/create-admin.input';
import { Admin } from './entities/admin.entity';
import { Role } from '../../common/enums/role.enum';
import { ID } from '../../@types';
import { UpdateCustomerInput } from '../customer/dto/update-customer.input';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { CommonValidator } from '../../common/validator/common-validator';
import { CreateAdminResult } from './unions/create-admin.union';

@Injectable()
export class AdminService extends BaseService<Admin> {
  constructor(
    @InjectRepository(Admin)
    private readonly repository: Repository<Admin>,
    private userService: UserService,
    private dataSource: DataSource,
  ) {
    super(repository);
  }

  async create(input: CreateAdminInput): Promise<typeof CreateAdminResult> {
    const { email, password } = input;
    const errors = await CommonValidator.simpleValidate(input);
    if (errors) return errors;

    const result = await this.dataSource.transaction('READ UNCOMMITTED', async (entityManager) => {
      const user = await this.userService.create(
        { email, password, role: Role.Admin },
        entityManager.getRepository(User),
      );
      return entityManager.getRepository(Admin).save({ name: input.name, user });
    });

    return this.repository.create(result);
  }

  async update(id: ID, input: UpdateCustomerInput) {
    await this.repository.update(id, input);
    return this.findOne(id);
  }
}
