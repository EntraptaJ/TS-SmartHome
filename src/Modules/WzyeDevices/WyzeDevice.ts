// src/Modules/WyzeDevices/WyzeDevice.ts
import { Field, ID, ObjectType } from 'type-graphql';
import { WyzeDeviceParams } from './WyzeDeviceParams';

@ObjectType()
export class WyzeDevice implements Partial<import('wyze-node').Device> {
  @Field(() => ID)
  public readonly mac: string;

  @Field()
  public nickname: string;

  @Field(() => String)
  public timezone_name: string;

  @Field()
  public product_model: string;

  @Field()
  public product_model_logo_url: string;

  @Field()
  public product_type: string;

  @Field()
  public hardware_ver: string;

  @Field()
  public firmware_ver: string;

  @Field(() => WyzeDeviceParams)
  public device_params: WyzeDeviceParams;
}
