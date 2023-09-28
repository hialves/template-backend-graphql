import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../../common/service.repository';
import { CreateCustomerInput } from './dto/create-customer.input';
import { Customer } from './entities/customer.entity';
import { ID } from '../../@types';
import { UpdateCustomerInput } from './dto/update-customer.input';

@Injectable()
export class CustomerService extends BaseService<Customer> {
  constructor(
    @InjectRepository(Customer)
    private readonly repository: Repository<Customer>,
  ) {
    super(repository);
  }

  async create(input: CreateCustomerInput) {
    // TODO
    return this.repository.save({});
  }

  async findOne(id: ID) {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: ID, input: UpdateCustomerInput) {
    return this.repository.update(id, input);
  }

  getByUserId(userId: ID): Promise<Customer | null> {
    return this.repository.findOneBy({ userId });
  }
}
