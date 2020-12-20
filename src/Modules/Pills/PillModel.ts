// src/Modules/Pills/PillModel.ts
import { Field, Float, ID, ObjectType } from 'type-graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Pill {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Field()
  @Column('varchar')
  public name: string;

  @Field(() => Float)
  @Column('float', {
    default: 4,
  })
  public interval: number;

  @Field(() => Float)
  @Column('float', {
    default: 3.5,
  })
  public minimumInterval: number;
}
