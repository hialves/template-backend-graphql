import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ID } from '../../../@types';
import { BaseEntity } from '../../../common/typeorm/base-entity';
import { User } from '../../user/entities/user.entity';

@ObjectType()
@Entity('session')
export class Session extends BaseEntity {
  @Field()
  @Column({ nullable: false })
  token: string;

  @Field()
  @Column('timestamp', { nullable: false })
  expiresAt: string;

  @Field()
  @Column({ nullable: false })
  valid: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  device?: string;

  @Field({ nullable: true })
  @Column()
  userId?: ID;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (relation) => relation.sessions, { cascade: true })
  user?: User;
}
