import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/typeorm/base-entity';
import { Role } from '../../../common/enums/role.enum';
import { Session } from '../../session/entities/session.entity';

registerEnumType(Role, {
  name: 'Role',
});

@ObjectType()
@Entity('user')
export class User extends BaseEntity {
  @Field()
  @Column({ nullable: true, select: false })
  password?: string;

  @Field()
  @Column({ nullable: false, unique: true })
  email: string;

  @Field(() => Role)
  @Column({ nullable: true, enum: Role })
  role?: Role;

  @Column({ nullable: true })
  recoverPasswordToken?: string;

  @Column('timestamp', { nullable: true })
  recoverPasswordTokenExpire?: string;

  @Column({ nullable: true })
  googleToken?: string;

  @Column('timestamp', { nullable: true })
  lastLogin?: string;

  @OneToMany(() => Session, (relation) => relation.user)
  sessions?: Session[];
}
