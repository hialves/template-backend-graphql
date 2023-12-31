import { ExecutionContext, Injectable, CanActivate, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IS_PUBLIC_KEY } from '../../decorators/public.decorator';
import { SessionService } from '../session/session.service';
import { Request } from 'express';
import { responseMessages } from '../../common/messages/response.messages';
import { IUserSession } from '../../common/interfaces/session.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext().req as Request;
    const token = this.sessionService.getBearerToken(request);
    let session: IUserSession;

    if (token) {
      session = await this.sessionService.getSession(token);
      if (session) request.session = session;
    }

    if (isPublic) {
      return true;
    }

    if (!token) throw new UnauthorizedException(responseMessages.auth.unauthorized);
    if (!session) throw new UnauthorizedException(responseMessages.auth.unauthorized);

    return true;
  }
}
