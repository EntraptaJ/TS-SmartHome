// src/Modules/Power/PowerUsageResovler.ts
import { format, isBefore, startOfDay, subDays } from 'date-fns';
import { Arg, ID, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { PowerUsageController } from './PowerUsageController';
import { PowerUsage } from './PowerUsageModel';

@Service()
@Resolver()
export class PowerUsageResovler {
  public constructor(private powerUsageController: PowerUsageController) {}

  @Query(() => [PowerUsage])
  public async powerUsage(): Promise<PowerUsage[]> {
    console.log('Hello');

    const powerUsages = await PowerUsage.find({});

    return powerUsages.sort(({ usageDate }, powerUsageBefore) =>
      isBefore(usageDate, powerUsageBefore.usageDate) ? 0 : -1,
    );
  }

  @Mutation(() => [PowerUsage])
  public async deletePowerUsage(
    @Arg('Id', () => ID) id: string,
  ): Promise<PowerUsage[]> {
    const powerUsage = await PowerUsage.findOneOrFail(id);

    await PowerUsage.remove(powerUsage);
    console.log('Hello');

    const powerUsages = await PowerUsage.find();

    return powerUsages.sort(({ usageDate }, powerUsageBefore) =>
      isBefore(usageDate, powerUsageBefore.usageDate) ? 0 : -1,
    );
  }

  @Mutation(() => PowerUsage)
  public async getPowerUsageLab(
    @Arg('usageDaysAgo', () => Int, { defaultValue: 1, nullable: true })
    usageDaysAgo: number,
  ): Promise<PowerUsage> {
    const usageDate = subDays(startOfDay(new Date()), usageDaysAgo);

    return this.powerUsageController.getHourlyPowerUsage(
      format(usageDate, 'M/d/y'),
    );
  }
}
