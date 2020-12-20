/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/Modules/SmartThingsDevices/SmartThingsDeviceResolver.ts
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { smartthings } from '../../Library/SmartThings';
import { SmartThingsDevice, isDeviceArray } from './SmartThingsDevice';

@Service()
@Resolver()
export class SmartThingsDeviceResolver {
  @Query(() => [SmartThingsDevice])
  public async smartThingsDevices(): Promise<SmartThingsDevice[]> {
    const { data } = await smartthings.devices.getList();

    if (isDeviceArray(data.items)) {
      return data.items;
    }

    throw new Error('Invalid SmartThings Response');
  }

  @Mutation(() => Boolean)
  public async testSmartThings(
    @Arg('deviceId') deviceId: string,
  ): Promise<boolean> {
    const test = await smartthings.devices.getStatus(deviceId);

    console.log(test.data.components.main);

    return true;
  }
}
