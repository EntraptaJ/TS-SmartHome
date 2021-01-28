// src/Modules/Weather/WeatherModel.ts
import { Field, Float, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Weather extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Field(() => Float)
  @Column('float')
  public temperature: number;

  @Field(() => Date)
  @Column('timestamp')
  public date: Date;
}
