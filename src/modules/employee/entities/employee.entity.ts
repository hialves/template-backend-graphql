import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from '../../../common/entity'

@Entity('employee')
export class Employee extends BaseEntity {
  @Column({ nullable: false })
  name: string

  @Column({ nullable: false })
  email: string

  @Column({ nullable: false })
  password: string

  @Column({ nullable: true })
  photo?: string

  @Column({ nullable: true })
  recoverPasswordToken?: string

  @Column('timestamp', { nullable: true })
  recoverPasswordTokenExpire?: string
}
