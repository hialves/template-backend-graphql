import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AdminService } from './app/admin/admin.service'
import { CreateAdminDto } from './app/admin/dto/create-admin.dto'
import { AuthService } from './app/auth/auth.service'
import { EmployeeAuthGuard } from './app/auth/employee-auth.guard'
import { ClientService } from './app/client/client.service'
import { CreateClientDto } from './app/client/dto/create-client.dto'
import { CreateEmployeeDto } from './app/employee/dto/create-employee.dto'
import { EmployeeService } from './app/employee/employee.service'
import { Public } from './decorators/public.decorator'
import { version } from '../package.json'
import { EntityType } from './@types'
import { MailService } from './mail/mail.service'

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly clientService: ClientService,
    private readonly employeeService: EmployeeService,
    private readonly adminService: AdminService,
    private readonly mailService: MailService,
  ) {}

  @Public()
  @Get()
  app() {
    return {
      name: `Harvest Food v${version}`,
      version,
    }
  }

  @Public()
  @UseGuards(AuthGuard('client'))
  @Post('auth/client/login')
  async clientLogin(@Request() req) {
    return this.authService.clientLogin(req.user)
  }

  @Public()
  @Post('auth/client/register')
  async clientRegister(@Body() dto: CreateClientDto) {
    return this.clientService.create(dto)
  }

  @Public()
  @UseGuards(EmployeeAuthGuard)
  @Post('auth/employee/login')
  async employeeLogin(@Request() req) {
    return this.authService.employeeLogin(req.user)
  }

  @Public()
  @Post('auth/employee/register')
  async employeeRegister(@Body() dto: CreateEmployeeDto) {
    return this.employeeService.create(dto)
  }

  @Public()
  @UseGuards(AuthGuard('admin'))
  @Post('auth/admin/login')
  async adminLogin(@Request() req) {
    return this.authService.adminLogin(req.user)
  }

  @Public()
  @Post('auth/admin/register')
  async adminRegister(@Body() dto: CreateAdminDto) {
    return this.adminService.create(dto)
  }

  @Public()
  @Post('send-email-recover-password/:entity')
  sendRecoverPassword(@Param('entity') entity: EntityType, @Body() body: { email: string }) {
    return this.authService.sendRecoverPasswordEmail(entity, body.email)
  }

  @Public()
  @Post('recover-password/:entity')
  recoverPassword(
    @Param('entity') entity: EntityType,
    @Query('token') token: string,
    @Body() body: { password: string },
  ) {
    return this.authService.resetPassword(entity, token, body.password)
  }

  @Public()
  @Post('send-mail')
  sendMail(@Body() body: { to: string; subject: string; html: string }) {
    return this.mailService.sendMail(body)
  }
}
