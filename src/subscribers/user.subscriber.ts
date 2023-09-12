import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';
import { CacheService } from '../connections/cache/cache.service';
import { cacheKeys } from '../common/cache/cache-keys';
import { Injectable } from '@nestjs/common';
import { User } from '../modules/user/entities/user.entity';
import * as bcrypt from 'bcrypt';

@EventSubscriber()
@Injectable()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(
    dataSource: DataSource,
    private cache: CacheService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async beforeUpdate(event: UpdateEvent<User>) {
    const updatedRole = Object.keys(event.entity).some((column) => column === 'role');
    if (updatedRole) {
      const key = cacheKeys.session.userById(event.entity.id);
      await this.cache.del(key);
    }
  }

  async beforeInsert(event: InsertEvent<User>) {
    event.entity.password = await bcrypt.hash(event.entity.password, 12);
  }
}
