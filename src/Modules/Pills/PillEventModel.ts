// src/Modules/Pills/PillEventModel.ts
import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PillEventType } from './PillEventType';
import { Pill } from './PillModel';

@ObjectType()
@Entity()
export class PillEvent extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Field()
  @Column('timestamp')
  public date: Date;

  @Field(() => PillEventType)
  @Column({
    type: 'enum',
    enum: PillEventType,
  })
  public type: PillEventType;

  @ManyToOne(() => Pill)
  @JoinColumn()
  public pill: Pill;

  @Column()
  public readonly pillId: string;
}
