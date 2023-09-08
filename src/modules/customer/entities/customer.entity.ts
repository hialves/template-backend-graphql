import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { BaseEntity } from '../../../common/typeorm/base-entity'
import { Asset } from '../../asset/entities/asset.entity'
import { User } from '../../user/entities/user.entity'
import { ID } from '../../../@types'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
@Entity('customer')
export class Customer extends BaseEntity {
  @Column({ nullable: false })
  @Field()
  name: string

  @Column({ nullable: false, select: false })
  password: string

  @Column({ nullable: true })
  cardToken?: string

  @Column({ nullable: true })
  @Field({ nullable: true })
  phone?: string

  @Column({ nullable: true })
  @Field({ nullable: true })
  assetId?: ID

  @OneToOne(() => Asset)
  @JoinColumn()
  @Field(() => Asset, { nullable: true })
  asset?: Asset

  @Column({ nullable: true })
  @Field({ nullable: true })
  userId?: ID

  @OneToOne(() => User, { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn()
  @Field(() => User, { nullable: true })
  user?: User
}
