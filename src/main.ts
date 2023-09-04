import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { Logger, ValidationPipe } from '@nestjs/common'
import { json } from 'express'
import { generateFolders } from './config/paths'

async function bootstrap() {
  generateFolders()
  const app = await NestFactory.create(AppModule, { bodyParser: false })
  app.enableCors()
  app.use(json({ limit: '50mb' }))
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  const configService = app.get(ConfigService)
  const port = configService.get('PORT')

  await app.listen(port, () =>
    Logger.log(`Listening for API calls on port \x1b[33m${port} 💻\x1b[37m`, 'NestApplication'),
  )
}

bootstrap()
