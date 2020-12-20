// src/Modules/WyzeDevices/WyzeDevice.ts
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class WyzeDevice implements Partial<import('wyze-node').Device> {
  @Field(() => ID)
  public readonly mac: string;

  @Field()
  public nickname: string;

  @Field()
  public hardware_ver: string;

  @Field()
  public firmware_ver: string;
}
