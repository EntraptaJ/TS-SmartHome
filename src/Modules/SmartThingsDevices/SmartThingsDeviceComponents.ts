// src/Modules/SmartThingsDevices/SmartThingsDeviceComponents.ts
import { Field, ObjectType } from 'type-graphql';
import { SmartThingsDeviceCapabillities } from './SmartThingsDeviceCapabilities';
import { SmartThingsCategories } from './SmartThingsDeviceCategories';

@ObjectType()
export class SmartThingsDeviceComponent {
  @Field()
  public id: string;

  @Field({ nullable: true })
  public label?: string;

  @Field(() => [SmartThingsDeviceCapabillities])
  public capabilities: SmartThingsDeviceCapabillities[];

  @Field(() => [SmartThingsCategories])
  public categories: SmartThingsCategories[];
}
