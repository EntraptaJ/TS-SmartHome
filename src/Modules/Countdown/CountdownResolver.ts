// src/Modules/Countdown/CountdownResolver.ts
import { Arg, Mutation, Query, Resolver, ID } from 'type-graphql';
import { Service } from 'typedi';
import { CountdownInput } from './CountdownInput';
import { Countdown } from './CountdownModel';

@Service()
@Resolver()
export class CountdownResolver {
  @Query(() => [Countdown], {
    description: 'Get all Countdown entities',
  })
  public countdowns(): Promise<Countdown[]> {
    return Countdown.find();
  }

  @Query(() => Countdown, {
    description: 'Get a single countdown entity',
  })
  public countdown(
    @Arg('countdownId', () => ID) id: string,
  ): Promise<Countdown> {
    return Countdown.findOneOrFail(id);
  }

  @Mutation(() => [Countdown], {
    description: 'Create a new countdown entity',
  })
  public async createCountdown(
    @Arg('input', () => CountdownInput) input: CountdownInput,
  ): Promise<Countdown[]> {
    const countdown = Countdown.create(input);

    await countdown.save();

    return Countdown.find();
  }

  @Mutation(() => Countdown, {
    description: 'Update an existing Countdown item from Id',
  })
  public async updateCountdown(
    @Arg('Id', () => ID) id: string,
    @Arg('input', () => CountdownInput) input: CountdownInput,
  ): Promise<Countdown> {
    const countdown = await Countdown.findOneOrFail(id);

    for (const [fieldName, fieldValue] of Object.entries(input)) {
      countdown[
        (fieldName as unknown) as keyof Omit<Countdown, 'id'>
      ] = fieldValue;
    }

    return countdown.save();
  }

  @Mutation(() => [Countdown])
  public async deleteCountdown(
    @Arg('countdownId', () => ID) id: string,
  ): Promise<Countdown[]> {
    const countdown = await Countdown.findOneOrFail(id);

    await Countdown.remove(countdown);

    return Countdown.find();
  }
}
