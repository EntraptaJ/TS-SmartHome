// src/Modules/Devices/Device.ts
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class Device implements Partial<import('wyze-node').Device> {
  @Field(() => ID)
  public readonly mac: string;

  @Field()
  public nickname: string;

  @Field()
  public hardware_ver: string;

  @Field()
  public firmware_ver: string;
}
