import { Resolver, Query, Context } from '@nestjs/graphql';
import { Request } from 'express';
import { Profile } from './unions/profile.union';
import { ProfileService } from './profile.service';

@Resolver()
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Query(() => Profile)
  me(@Context('req') req: Request) {
    return this.profileService.getProfile(req.session.userId);
  }
}
