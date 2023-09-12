import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { ID } from '../../@types';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeleteResult, NotFoundError } from '../../common/graphql/types/result-type';
import { responseMessages } from '../../common/messages/response.messages';
import * as bcrypt from 'bcrypt';
import { PaginatedList } from '../../common/dto/paginated-list';
import { PaginatedInput } from '../../common/dto/filter-input';
import { ILoginUser } from '../../common/interfaces/login-user.interface';
import dayjs from 'dayjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(input: CreateUserInput, repository: Repository<User> = this.repository): Promise<User> {
    const user = new User();
    repository.merge(user, input);
    return repository.save(user);
  }

  async findAll(filters?: PaginatedInput): Promise<PaginatedList<User>> {
    const totalItems = await this.repository.count();
    const items = await this.repository.find(filters);

    return new PaginatedList(items, totalItems);
  }

  async findOne(id: ID): Promise<User> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.repository.findOne({
      where: { email },
    });
  }

  async findByRecoverPasswordToken(recoverPasswordToken: string) {
    return this.repository.findOne({
      where: { recoverPasswordToken },
    });
  }

  async findByEmailLogin(email: string): Promise<ILoginUser | null> {
    return this.repository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async resetPassword(id: ID, plainPassword: string) {
    const passwordHash = await bcrypt.hash(plainPassword, 12);
    return this.repository.update(
      { id },
      { password: passwordHash, recoverPasswordToken: null, recoverPasswordTokenExpire: null },
    );
  }

  async exists(id: ID): Promise<boolean> {
    const result = await this.repository.findOne({
      where: { id },
      select: { id: true },
    });
    return !!result;
  }

  async delete(id: ID) {
    if (!(await this.exists(id))) return this.notFound(id);

    try {
      const result = await this.repository.delete({ id });
      return new DeleteResult(!!result);
    } catch (error) {
      return new DeleteResult(false, error.message);
    }
  }

  async updateLastLogin(id: ID): Promise<void> {
    await this.repository.update(id, { lastLogin: dayjs().toISOString() }).catch((e) => e);
  }

  async setRecoverPasswordData(id: ID, token: string) {
    const user = await this.findOne(id);
    if (!user) throw this.notFound(id);

    user.recoverPasswordToken = token;
    user.recoverPasswordTokenExpire = dayjs().add(30, 'minute').toISOString();
    await this.repository.save(user);
  }

  notFound(id: ID): NotFoundError {
    const { entity } = responseMessages.user;
    return new NotFoundError(responseMessages.notFound(entity), id.toString());
  }

  getCredentials(email: string) {
    return this.repository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
  }

  async updateEmail(id: ID, email: string) {
    await this.repository.update(id, { email });
    return this.findOne(id);
  }
}
