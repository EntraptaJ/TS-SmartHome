// src/Modules/Sensors/SensorResolver.ts
import { Arg, ID, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { Sensor } from './SensorModel';
import { SensorTemperature } from './SensorTemperatureModel';

@Service()
@Resolver()
export class SensorResolver {
  @Query(() => [Sensor])
  public sensor(): Promise<Sensor[]> {
    return Sensor.find();
  }

  @Query(() => [SensorTemperature])
  public sensorTemperatures(): Promise<SensorTemperature[]> {
    return SensorTemperature.find();
  }

  @Mutation(() => [Sensor])
  public async createSensor(
    @Arg('smartThingsId', () => ID) smartThingsId: string,
  ): Promise<Sensor[]> {
    const sensor = Sensor.create({
      smartThingsId,
    });

    await sensor.save();

    return Sensor.find();
  }
}
