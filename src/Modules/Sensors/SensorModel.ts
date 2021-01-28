// src/Modules/Sensors/SensorModel.ts
import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Sensor extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Field()
  @Column('varchar')
  public smartThingsId: string;
}
