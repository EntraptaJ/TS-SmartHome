/* eslint-disable @typescript-eslint/no-explicit-any */
// src/Modules/SmartThingsDevices/SmartThingsDevice.ts
import { Field, ID, ObjectType } from 'type-graphql';
import { SmartThingsDeviceComponent } from './SmartThingsDeviceComponents';
import { SmartThingsDeviceType } from './SmartThingsDeviceType';

@ObjectType()
export class SmartThingsDevice {
  @Field(() => ID, { description: 'The identifier for the device instance.' })
  public readonly deviceId: string;

  @Field({
    nullable: true,
    description:
      'The name that the device integration (Device Handler or SmartApp) defines for the device.',
  })
  public name: string;

  @Field({
    nullable: true,
    description:
      'The name that a user chooses for the device. This defaults to the same value as name.',
  })
  public label: string;

  @Field({
    description: 'The device manufacturer name.',
  })
  public manufacturerName: string;

  @Field({
    description: 'An non-unique id that is used to help drive UI information.',
  })
  public presentationId: string;

  @Field({
    nullable: true,
    description: 'The device manufacturer code.',
  })
  public deviceManufacturerCode: string;

  @Field({
    nullable: true,
    description: 'The ID of the Location with which the device is associated.',
  })
  public locationId: string;

  @Field({
    nullable: true,
    description: 'The identifier for the owner of the device instance.',
  })
  @Field({
    nullable: true,
    description:
      'The ID of the Room with which the device is associated. If the device is not associated with any room, then this field will be null.',
  })
  public roomId: string;

  @Field({
    deprecationReason: 'Deprecated please look under "dth".',
    nullable: true,
  })
  public deviceTypeId: string;

  @Field({
    deprecationReason: 'Deprecated please look under "dth".',
    nullable: true,
  })
  public deviceTypeName: string;

  @Field({
    deprecationReason: 'Deprecated please look under "dth".',
  })
  public deviceNetworkType: string;

  @Field(() => [SmartThingsDeviceComponent], {
    nullable: true,
    description: 'The IDs of all compenents on the device.',
  })
  public components: SmartThingsDeviceComponent[];

  @Field(() => SmartThingsDeviceType, {
    nullable: true,
  })
  public type: SmartThingsDeviceType;
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
