// src/Modules/Extras/DateResolver.ts
import { add } from 'date-fns';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { DurationInput } from './DurationInput';

@Service()
@Resolver()
export class DateResolver {
  @Query(() => Date, {
    description: 'Get the current time',
  })
  public getNowDate(): Date {
    return new Date();
  }

  @Mutation(() => Date, {
    description: 'Calculate a date',
  })
  public getDate(
    @Arg('startDate', () => Date, {
      nullable: true,
      defaultValue: new Date(),
    })
    startDate: Date,
    @Arg('duration', () => DurationInput) input: DurationInput,
  ): Date {
    return add(startDate, input);
  }

  /*   @Mutation(() => Int)
  public addTime(
    @Arg('source', () => TimeInput) source: TimeInput,
    @Arg('input', () => TimeInput) input: TimeInput,
  ): number {
    return getMil;
  } */
}
