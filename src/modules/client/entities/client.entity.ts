import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from '../../../common/entity'
import { Role } from '../../../enums/role.enum'

@Entity('client')
export class Client extends BaseEntity {
  @Column({ nullable: false })
  name: string

  @Column({ nullable: false, unique: true })
  email: string

  @Column({ nullable: false, select: false })
  password: string

  @Column({ nullable: true })
  photo?: string

  @Column({ nullable: true })
  cardToken?: string

  @Column({ nullable: true })
  googleToken?: string

  @Column({ nullable: true })
  facebookToken?: string

  @Column({ nullable: true })
  phone?: string

  @Column({
    type: 'enum',
    enum: [Role.Client],
    nullable: true,
    default: Role.Client,
  })
  role: Role

  @Column({ nullable: true })
  recoverPasswordToken?: string

  @Column('timestamp', { nullable: true })
  recoverPasswordTokenExpire?: string
}
