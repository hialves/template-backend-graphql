import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import dayjs from 'dayjs';

import { MailService } from '../../mail/mail.service';
import { UserService } from '../user/user.service';
import { InvalidCredentialsError, NotFoundError, SuccessResult } from '../../common/graphql/types/result-type';
import { responseMessages } from '../../common/messages/response.messages';
import { LoginInput } from './dto/login.input';
import { SessionService } from '../session/session.service';
import { apiConfig } from '../../config/api.config';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private mailService: MailService,
    private userService: UserService,
    private sessionService: SessionService,
  ) {}

  async sendRecoverPasswordEmail(email: string) {
    const resetToken = crypto.randomBytes(20).toString('hex');
    const token = crypto.createHash('sha256').update(resetToken).digest('hex');
    let user = await this.userService.findByEmail(email);
    if (!user) return new NotFoundError(responseMessages.notFound(responseMessages.user.entity), email);
    await this.userService.setRecoverPasswordData(user.id, token);

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
    });
  }

  async resetPassword(token: string, newPassword: string) {
    let user = await this.userService.findByRecoverPasswordToken(token);

    if (user.recoverPasswordTokenExpire && dayjs().isAfter(dayjs(user.recoverPasswordTokenExpire))) {
      throw new BadRequestException('Token expirado');
    }

    await this.userService.resetPassword(user.id, newPassword);
  }

  async login(input: LoginInput, response: Response) {
    const user = await this.userService.findByEmailLogin(input.email);
    if (!user) return new InvalidCredentialsError();
    const passwordMatch = await bcrypt.compare(input.password, user.password);
    if (!passwordMatch) return new InvalidCredentialsError();

    const authToken = await this.sessionService.createAuthenticatedSession(user, input.device);
    const { authTokenHeaderKey } = apiConfig;
    response.header(authTokenHeaderKey, authToken);

    return new SuccessResult(responseMessages.auth.loginSuccess);
  }
}
