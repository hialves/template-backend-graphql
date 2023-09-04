export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      PORT: string
      FRONT_END_DOMAIN: string
      JWT_SECRET_KEY: string
      TEST_DATABASE: string
      TYPEORM_HOST: string
      TYPEORM_USERNAME: string
      TYPEORM_PASSWORD: string
      TYPEORM_LOGGING: string
      TYPEORM_PORT: string
      TYPEORM_DATABASE: string
      HOST_EMAIL: string
      PORT_EMAIL: string
      EMAIL_FROM: string
      EMAIL_USER: string
      EMAIL_PASS: string
    }
  }
}
