import { Admin } from '../../../modules/admin/entities/admin.entity'
import { User } from '../../../modules/user/entities/user.entity'

export interface IGql<T> {
  toJSON(): T & { __typename: string }
}

export class Gql<T> implements IGql<T> {
  constructor(public __typename: string, public entity: T) {
    Object.entries(entity).forEach(([key, value]) => {
      this[key] = value
    })
  }

  toJSON() {
    return { ...this.entity, __typename: this.__typename }
  }
}

export class UserGql extends Gql<User> {
  constructor(entity: User) {
    const __typename = 'User'
    super(__typename, entity)
  }
}

export class AdminGql extends Gql<Admin> {
  constructor(entity: Admin) {
    const __typename = 'Admin'
    super(__typename, entity)
  }
}
