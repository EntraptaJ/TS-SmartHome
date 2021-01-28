// src/Modules/Countdown/CountdownModel.ts
import { Field, ID, Int, ObjectType } from 'type-graphql';
import { Column, PrimaryGeneratedColumn, BaseEntity, Entity } from 'typeorm';
import { differenceInSeconds } from 'date-fns';

@ObjectType()
@Entity()
export class Countdown extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Field()
  @Column('timestamp')
  public targetDate: Date;

  @Field(() => Int)
  public secondsLeft(): number {
    return differenceInSeconds(this.targetDate, new Date());
  }
}
