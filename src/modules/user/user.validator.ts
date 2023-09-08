import { Injectable, OnModuleInit } from '@nestjs/common'
import { UserService } from '../user/user.service'
import { ModuleRef } from '@nestjs/core'

@Injectable()
export class UserValidator implements OnModuleInit {
  private userService: UserService

  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.userService = this.moduleRef.get(UserService)
  }
}
