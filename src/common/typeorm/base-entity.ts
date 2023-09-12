import { ObjectType, Field } from '@nestjs/graphql';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ID } from '../../@types';

@ObjectType()
export class BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('increment')
  id: ID;

  @Field()
  @CreateDateColumn()
  createdAt: string;

  @Field()
  @UpdateDateColumn()
  updatedAt: string;
}
