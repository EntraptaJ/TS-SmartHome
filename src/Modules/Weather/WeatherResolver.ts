// src/Modules/Weather/WeatherResolver.ts
import { Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { Weather } from './WeatherModel';

@Service()
@Resolver()
export class WeatherResolver {
  @Query(() => [Weather], {
    description: 'Retrieve all weather records',
  })
  public weather(): Promise<Weather[]> {
    return Weather.find();
  }
}
