import { Injectable, BadRequestException, Inject, forwardRef } from '@nestjs/common'
import { ClientService } from '../client/client.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { Client } from '../client/entities/client.entity'
import { Employee } from '../employee/entities/employee.entity'
import { EmployeeService } from '../employee/employee.service'
import { Admin } from '../admin/entities/admin.entity'
import { AdminService } from '../admin/admin.service'
import { Role } from '../../enums/role.enum'
import { IAccessToken } from '../../@types/custom'
import { EntityType } from '../../@types'
import { DataSource, Repository } from 'typeorm'
import * as crypto from 'crypto'
import dayjs from 'dayjs'
import { MailService } from '../../mail/mail.service'

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => AdminService))
    private adminService: AdminService,
    @Inject(forwardRef(() => ClientService))
    private clientService: ClientService,
    @Inject(forwardRef(() => EmployeeService))
    private employeeService: EmployeeService,
    private jwtService: JwtService,
    private dataSource: DataSource,
    private mailService: MailService,
  ) {}

  async validateClient(email: string, pass: string): Promise<IAccessToken> {
    const credentials = await this.clientService.getCredentials(email)
    const match = await bcrypt.compare(pass, credentials.password)

    if (match) {
      const client = await this.clientService.repository.findOneBy({
        id: credentials.id,
      })
      const payload: IAccessToken = {
        id: client.id,
        email: client.email,
        role: client.role,
      } as IAccessToken

      return payload
    }
    return null
  }

  async clientLogin(client: Client) {
    const { password, cardToken, facebookToken, googleToken, phone, ...payload } = client

    return {
      accessToken: this.jwtService.sign(payload),
    }
  }

  async validateEmployee(email: string, password: string): Promise<any> {
    const credentials = await this.employeeService.getCredentials(email)
    const match = await bcrypt.compare(password, credentials.password)

    if (match) {
      let role = Role.NoRole
      const employee = await this.employeeService.repository.findOneBy({
        id: credentials.id,
      })
      return { ...employee, role }
    }
    return null
  }

  async employeeLogin(employee: Employee & { role: Role }) {
    const payload: IAccessToken = {
      id: employee.id,
      email: employee.email,
      role: employee.role,
    }

    return {
      accessToken: this.jwtService.sign(payload),
    }
  }

  async validateAdmin(email: string, pass: string): Promise<any> {
    const credentials = await this.adminService.getCredentials(email)
    const match = await bcrypt.compare(pass, credentials.password)

    if (match) {
      const admin = await this.adminService.repository.findOneBy({
        id: credentials.id,
      })
      return admin
    }
    return null
  }

  async adminLogin(admin: Admin) {
    const payload: IAccessToken = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    }

    return {
      accessToken: this.jwtService.sign(payload),
    }
  }

  async sendRecoverPasswordEmail(entity: EntityType, email: string) {
    const resetToken = crypto.randomBytes(20).toString('hex')
    const token = crypto.createHash('sha256').update(resetToken).digest('hex')
    let user: {
      recoverPasswordToken?: string
      recoverPasswordTokenExpire?: string
    } = await this.getUserRepository(entity).findOneBy({ email })
    user.recoverPasswordToken = token
    user.recoverPasswordTokenExpire = dayjs().add(30, 'minute').toISOString()

    await this.dataSource.manager.save(user)
    await this.mailService.sendMail({
      to: email,
      subject: 'Recuperação de senha',
      // TODO
      html: `
        <html>
          <body>
            <a href="${process.env.FRONT_END_DOMAIN}/recover-password?token=${token}">Recuperar senha</span>
            <br>
            <a href="${process.env.FRONT_END_DOMAIN}/recover-password?token=${token}">${process.env.FRONT_END_DOMAIN}/recover-password/${token}</span>
          </body>
        </html>`,
    })
  }

  async resetPassword(entity: EntityType, token: string, newPassword: string) {
    let user: {
      password: string
      recoverPasswordToken?: string
      recoverPasswordTokenExpire?: string
    } = await this.getUserRepository(entity).findOneBy({
      recoverPasswordToken: token,
    })

    if (user.recoverPasswordTokenExpire && dayjs().isAfter(dayjs(user.recoverPasswordTokenExpire))) {
      throw new BadRequestException('Token expirado')
    }

    user.password = await this.hashPassword(newPassword)
    user.recoverPasswordToken = null
    user.recoverPasswordTokenExpire = null
    await this.dataSource.manager.save(user)
  }

  getUserRepository(entity: EntityType): Repository<Admin> | Repository<Client> | Repository<Employee> {
    return {
      admin: this.adminService,
      client: this.clientService,
      employee: this.employeeService,
    }[entity].repository
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 12)
  }
}
