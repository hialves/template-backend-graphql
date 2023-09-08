import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { AuthService } from './modules/auth/auth.service'
import { IsPublic } from './decorators/public.decorator'
import { version } from '../package.json'

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Get()
  app() {
    return {
      name: `App v${version}`,
      version,
    }
  }

  @IsPublic()
  @Post('send-recover-password')
  sendRecoverPassword(@Body() body: { email: string }) {
    return this.authService.sendRecoverPasswordEmail(body.email)
  }

  @IsPublic()
  @Post('recover-password')
  recoverPassword(@Query('token') token: string, @Body() body: { password: string }) {
    return this.authService.resetPassword(token, body.password)
  }
}
