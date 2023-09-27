import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { Request, Response } from 'express';
import { DefaultResult, DeleteResult } from '../../common/graphql/types/result-type';
import { IsPublic } from '../../decorators/public.decorator';

@Resolver()
export class AuthResolver {
  constructor(private service: AuthService) {}

  @IsPublic()
  @Mutation(() => DefaultResult)
  login(@Args('input') input: LoginInput, @Context('res') res: Response) {
    return this.service.login(input, res);
  }

  @IsPublic()
  @Mutation(() => DefaultResult)
  logout(@Context('req') req: Request): Promise<DeleteResult> {
    return this.service.logout(req.session);
  }
}
