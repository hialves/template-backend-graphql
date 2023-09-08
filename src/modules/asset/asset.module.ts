import { Module } from '@nestjs/common'
import { AssetService } from './asset.service'
import { AssetResolver } from './asset.resolver'
import { Asset } from './entities/asset.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([Asset])],
  providers: [AssetResolver, AssetService],
  exports: [AssetService],
})
export class AssetModule {}
