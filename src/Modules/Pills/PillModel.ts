// src/Modules/Pills/PillModel.ts
import { addMinutes } from 'date-fns';
import { Arg, Field, Float, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { logger, LogMode } from '../../Library/Logger';
import { PillEvent } from './PillEventModel';
import { PillEventType } from './PillEventType';

@ObjectType()
@Entity()
export class Pill extends BaseEntity {
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

  @Field(() => PillEvent)
  public async latestPillEvent(
    @Arg('eventType', () => PillEventType, { nullable: true })
    eventTypeFilter?: PillEventType,
  ): Promise<PillEvent | undefined> {
    const pillEvents = await PillEvent.find({
      where: {
        pillId: this.id,
        type: eventTypeFilter,
      },
      order: {
        date: 'DESC',
      },
      take: 1,
    });

    logger.log(LogMode.DEBUG, 'Retrieved latest PillEvents');

    return pillEvents[0];
  }

  @Field(() => Date)
  public async nextEarliestDose(): Promise<Date> {
    const latestPillTakenEvent = await this.latestPillEvent(
      PillEventType.TAKEN,
    );

    logger.log(LogMode.DEBUG, 'Latest taken: ', latestPillTakenEvent);

    return latestPillTakenEvent
      ? addMinutes(latestPillTakenEvent.date, this.minimumInterval * 60)
      : new Date();
  }
}
