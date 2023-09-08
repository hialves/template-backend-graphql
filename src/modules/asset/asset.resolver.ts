import { Resolver, Query, Args } from '@nestjs/graphql'
import { AssetService } from './asset.service'
import { InputPipe } from '../../common/pipes/input.pipe'
import { PaginatedInput } from '../../common/dto/filter-input'
import { IsPublic } from '../../decorators/public.decorator'
import { ID } from '../../@types'

@Resolver('Asset')
export class AssetResolver {
  constructor(private readonly assetService: AssetService) {}

  @Query()
  @IsPublic()
  assets(@Args('filters', InputPipe) filters: PaginatedInput) {
    return this.assetService.findAll(filters)
  }

  @Query()
  @IsPublic()
  asset(@Args('id') id: ID) {
    return this.assetService.findOne(id)
  }
}
