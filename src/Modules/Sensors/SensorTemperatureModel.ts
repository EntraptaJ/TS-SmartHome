// src/Modules/Sensors/SensorTemperature.ts
import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class SensorTemperature extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Field(() => Date)
  @Column({
    type: 'timestamp',
  })
  public date: Date;

  @Field(() => ID)
  @Column('varchar')
  public sensorId: string;

  @Field()
  @Column('varchar', {
    default: '4.5C',
  })
  public temperature: string;
}
