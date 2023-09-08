import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../../../common/typeorm/base-entity'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
@Entity('asset')
export class Asset extends BaseEntity {
  @Column({ nullable: false })
  @Field()
  filename: string

  @Column({ nullable: false })
  @Field()
  source: string

  @Column({ nullable: false })
  @Field()
  mimeType: string
}
