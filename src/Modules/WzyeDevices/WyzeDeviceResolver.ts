// src/Modules/Devices/DeviceResolver.ts
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { wyze } from '../../Library/Wyze';
import { WyzeDevice } from './WyzeDevice';
import { WyzeDeviceService } from './WyzeDeviceService';

@Service()
@Resolver()
export class DeviceResolver {
  public constructor(private readonly wyzeService: WyzeDeviceService) {}

  @Query(() => [WyzeDevice])
  public async wyzeDevices(): Promise<WyzeDevice[]> {
    return this.wyzeService.getAllDevices();
  }

  @Query(() => WyzeDevice)
  public wyzeDeviceByName(
    @Arg('deviceName', () => String) deviceName: string,
  ): Promise<WyzeDevice> {
    return wyze.getDeviceByName(deviceName);
  }

  @Mutation(() => Boolean)
  public async powerOnWyzeDevice(
    @Arg('deviceName', () => String) deviceName: string,
  ): Promise<boolean> {
    return this.wyzeService.powerOnDeviceByName(deviceName);
  }

  @Mutation(() => Boolean)
  public async powerOffWyzeDevice(
    @Arg('deviceName', () => String) deviceName: string,
  ): Promise<boolean> {
    return this.wyzeService.powerOffDeviceByName(deviceName);
  }
}
