// src/Modules/SmartThingsDevices/SmartThingsDeviceCapabillities.ts
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class SmartThingsDeviceCapabillities {
  @Field()
  public id: string;

  @Field(() => Int)
  public version: number;
}
