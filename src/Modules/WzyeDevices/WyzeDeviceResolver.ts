// src/Modules/Devices/DeviceResolver.ts
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { wyze } from '../../Library/Wyze';
import { WyzeDevice } from './WyzeDevice';

@Service()
@Resolver()
export class DeviceResolver {
  @Query(() => [WyzeDevice])
  public async wyzeDevices(): Promise<WyzeDevice[]> {
    const wyzeDevices = await wyze.getDeviceList();

    return wyzeDevices;
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
    const wyzeDevice = await wyze.getDeviceByName(deviceName);

    try {
      await wyze.turnOn(wyzeDevice);
      return true;
    } catch {
      return false;
    }
  }

  @Mutation(() => Boolean)
  public async powerOffWyzeDevice(
    @Arg('deviceName', () => String) deviceName: string,
  ): Promise<boolean> {
    const wyzeDevice = await wyze.getDeviceByName(deviceName);

    try {
      await wyze.turnOff(wyzeDevice);
      return true;
    } catch {
      return false;
    }
  }
}
