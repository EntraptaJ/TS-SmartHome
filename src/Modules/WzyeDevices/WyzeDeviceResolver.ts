// src/Modules/Devices/DeviceResolver.ts
import { Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { wyze } from '../../Library/Wyze';
import { WyzeDevice } from './WyzeDevice';

@Service()
@Resolver()
export class DeviceResolver {
  @Query(() => [WyzeDevice])
  public devices(): Promise<WyzeDevice[]> {
    return wyze.getDeviceList();
  }
}
