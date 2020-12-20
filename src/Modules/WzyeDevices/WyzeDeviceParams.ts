// src/Modules/WzyeDevices/WyzeDeviceParams.ts
import { Field, Int, ObjectType } from 'type-graphql';
import type { DeviceStatus } from 'wyze-node';
import { WyzeCameraThumbnailParams } from './WyzeCameraThumbnailParams';
import { WyzeDevicePowerState } from './WyzeDevicePowerState';

@ObjectType()
export class WyzeDeviceParams implements DeviceStatus {
  @Field()
  public p2p_id: string;

  @Field()
  public p2p_type: number;

  @Field()
  public ssid: string;

  @Field()
  public ip: string;

  @Field(() => WyzeDevicePowerState)
  public power_switch: WyzeDevicePowerState;

  @Field()
  public temperature: string;

  @Field()
  public humidity: string;

  public temp_humi_room_type: number;

  public comfort_standard_level: number;

  public is_temperature_humidity: number;

  public records_event_switch: number;

  public motion_alarm_switch: number;

  public audio_alarm_switch: number;

  public smoke_alarm_switch: number;

  public co_alarm_switch: number;

  public electricity: string;

  public battery_charging_status: string;

  public is_link_toy_car: number;

  @Field()
  public power_saving_mode_switch: number;

  @Field(() => WyzeCameraThumbnailParams)
  public camera_thumbnails: WyzeCameraThumbnailParams;
}
