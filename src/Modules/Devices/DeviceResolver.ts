// src/Modules/Devices/DeviceResolver.ts
import { Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { wyze } from '../../Library/Wyze';
import { Device } from './Device';

@Service()
@Resolver()
export class DeviceResolver {
  @Query(() => [Device])
  public devices(): Promise<Device[]> {
    return wyze.getDeviceList();
  }
}
