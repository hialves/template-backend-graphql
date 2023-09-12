import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { BaseEntity } from './typeorm/base-entity';
import { ID } from '../@types';

@Injectable()
export class BaseService<T extends BaseEntity> {
  private entity: Repository<T>;

  constructor(entity: Repository<T>) {
    this.entity = entity;
  }

  async findAll(query: any) {
    return this.entity.find({ where: query });
  }

  async findOne(id: ID) {
    return this.entity.findOneBy({ id } as any);
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.entity.delete(id);
  }
}
