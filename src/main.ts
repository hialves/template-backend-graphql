import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { Logger } from '@nestjs/common'
import { json } from 'express'
import { generateFolders } from './config/paths'
import { apiConfig } from './config/api.config'

async function bootstrap() {
  generateFolders()
  const app = await NestFactory.create(AppModule, { bodyParser: false })
  app.enableCors({ exposedHeaders: apiConfig.exposedHeaders, origin: '*' })
  app.use(json({ limit: '10mb' }))
  const configService = app.get(ConfigService)
  const port = configService.get('PORT')

  await app.listen(port, async () => {
    Logger.log(`Listening for API calls on \x1b[33m${await app.getUrl()} 💻\x1b[37m`, 'NestApplication')
    Logger.log(`Listening for GraphQL calls on \x1b[33m${await app.getUrl()}/graphql 💻\x1b[37m`, 'NestApplication')
  })
}

bootstrap()
