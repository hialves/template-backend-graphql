import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createTransport } from 'nodemailer'

@Injectable()
export class MailService {
  constructor(private config: ConfigService) {}

  async sendMail(data: { to: string; subject: string; html: any }) {
    const { to, subject, html } = data

    const transporter = createTransport({
      host: this.config.get('HOST_EMAIL'),
      port: parseInt(this.config.get('PORT_EMAIL')),
      auth: {
        user: this.config.get('EMAIL_USER'),
        pass: this.config.get('EMAIL_PASS'),
      },
    })

    const mailOptions = {
      from: this.config.get('EMAIL_FROM'),
      to,
      subject,
      html,
    }

    return new Promise((resolve) => {
      return transporter.sendMail(mailOptions, function (error) {
        resolve(!error)
      })
    })
  }
}
