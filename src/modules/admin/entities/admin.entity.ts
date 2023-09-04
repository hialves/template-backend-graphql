import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../../../common/entity'
import { Role } from '../../../enums/role.enum'

@Entity('admin')
export class Admin extends BaseEntity {
  @Column({ nullable: false })
  name: string

  @Column({ nullable: false, unique: true })
  email: string

  @Column({ nullable: false, select: false })
  password: string

  @Column({ nullable: true })
  photo?: string

  @Column({
    type: 'enum',
    enum: [Role.SuperAdmin, Role.Admin],
    nullable: true,
    default: Role.Admin,
  })
  role: Role

  @Column({ nullable: true })
  recoverPasswordToken?: string

  @Column('timestamp', { nullable: true })
  recoverPasswordTokenExpire?: string
}
