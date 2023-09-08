import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { Response } from 'express';
import { DefaultResult } from '../../common/graphql/types/result-type';

@Resolver()
export class AuthResolver {
  constructor(private service: AuthService) {}

  @Mutation(() => DefaultResult)
  login(@Args('input') input: LoginInput, @Context('res') res: Response) {
    return this.service.login(input, res);
  }
}
