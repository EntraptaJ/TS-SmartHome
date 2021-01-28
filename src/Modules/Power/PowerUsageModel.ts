// src/Modules/Power/PowerUsageModel.ts
import { format } from 'date-fns';
import { Field, Float, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class PowerUsage extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Field(() => [Float])
  @Column('float', {
    array: true,
  })
  public hourlyUsage: number[];

  @Field(() => Date)
  @Column('varchar', {
    unique: true,
    transformer: {
      from(dateStr: string): Date {
        return new Date(dateStr);
      },
      to(date: Date | string): string {
        console.log(date);

        if (typeof date === 'string') {
          return date;
        }

        return format(date, 'M/d/y');
      },
    },
  })
  public usageDate: Date;

  @Field(() => Float)
  public get totalDayUsage(): number {
    return this.hourlyUsage.reduce((a, b) => a + b, 0);
  }
}
