import { ObjectType, Field, ID } from '@nestjs/graphql';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
export class BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field()
  @CreateDateColumn()
  createdAt: string;

  @Field()
  @UpdateDateColumn()
  updatedAt: string;
}
