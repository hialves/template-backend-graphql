import { Module } from '@nestjs/common'
import { CacheService } from './cache.service'
import { CacheModule as CacheManager } from '@nestjs/cache-manager'

const FIVE_SECONDS = 1000 * 5
@Module({
  imports: [CacheManager.register({ ttl: FIVE_SECONDS })],

  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
