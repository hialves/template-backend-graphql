import { BadRequestException, Injectable } from '@nestjs/common'
import { DeepPartial, DeleteResult, Repository } from 'typeorm'
import { BaseEntity } from './entity'

interface IValidateObject {
  key: string
  value: any
  errorMessage: string
}

@Injectable()
export class BaseService<T> {
  private entity: Repository<any>

  constructor(entity: Repository<T>) {
    this.entity = entity
  }

  async create(dto: T | any, ...args: any): Promise<T | T[]> {
    return this.entity.save(dto)
  }

  async findAll(query: any) {
    return this.entity.find({ where: query })
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.entity.delete(id)
  }

  async validateIfExists(validateObjects: IValidateObject[] | IValidateObject): Promise<void> {
    const errors = []
    const arrayToValidate = Array.isArray(validateObjects) ? [...validateObjects] : [validateObjects]

    for (const validate of arrayToValidate) {
      const exists = await this.handleIfExists(validate)
      exists && errors.push(validate.errorMessage)
    }

    if (errors.length) throw new BadRequestException(errors)
  }

  async handleIfExists(validateObject: IValidateObject): Promise<string | boolean> {
    const { key, value, errorMessage } = validateObject
    const entity = await this.entity.findOne({
      where: { [key]: value },
    })
    if (entity) return errorMessage
    return false
  }

  get repository() {
    return this.entity
  }
}
