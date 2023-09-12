import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { UserService } from '../../modules/user/user.service';
import { CacheService } from '../../connections/cache/cache.service';
import { cacheKeys } from '../cache/cache-keys';
import ms from 'ms';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
    private cache: CacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext().req as Request;
    const session = request.session;

    const key = cacheKeys.session.userById(session.userId);
    const user = await this.cache.getAndSave(key, () => this.userService.findOne(session.userId), ms('1hour'));

    return requiredRoles.some((role) => user.role === role);
  }
}
