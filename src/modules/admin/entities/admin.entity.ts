import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/typeorm/base-entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Asset } from '../../asset/entities/asset.entity';
import { ID } from '../../../@types';
import { User } from '../../user/entities/user.entity';

@ObjectType()
@Entity('admin')
export class Admin extends BaseEntity {
  @Column({ nullable: false })
  @Field()
  name: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  assetId?: ID;

  @OneToOne(() => Asset)
  @JoinColumn()
  @Field(() => Asset, { nullable: true })
  asset?: Asset;

  @Column({ nullable: true })
  @Field({ nullable: true })
  userId?: ID;

  @OneToOne(() => User, { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn()
  @Field(() => User, { nullable: true })
  user?: User;
}
