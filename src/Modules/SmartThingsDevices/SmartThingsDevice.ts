/* eslint-disable @typescript-eslint/no-explicit-any */
// src/Modules/SmartThingsDevices/SmartThingsDevice.ts
import { Field, ID, ObjectType } from 'type-graphql';
import { SmartThingsDeviceComponent } from './SmartThingsDeviceComponents';

@ObjectType()
export class SmartThingsDevice {
  @Field(() => ID)
  public readonly deviceId: string;

  @Field()
  public name: string;

  @Field()
  public label: string;

  @Field()
  public manufacturerName: string;

  @Field()
  public presentationId: string;

  @Field()
  public deviceManufacturerCode: string;

  @Field()
  public locationId: string;

  @Field()
  public roomId: string;

  @Field()
  public deviceTypeId: string;

  @Field()
  public deviceTypeName: string;

  @Field()
  public deviceNetworkType: string;

  @Field(() => [SmartThingsDeviceComponent])
  public components: SmartThingsDeviceComponent[];
}

export function isDeviceArray(
  inputArray: any[],
): inputArray is SmartThingsDevice[] {
  if (Array.isArray(inputArray)) {
    if ('deviceId' in inputArray[0]) {
      return true;
    }
  }

  return false;
}
