// src/Modules/SmartThingsDevcies/SmartThingsDeviceType.ts
import { registerEnumType } from 'type-graphql';

export enum SmartThingsDeviceType {
  BLE = 'BLE',
  BLE_D2D = 'BLE_D2D',
  DTH = 'DTH',
  ENDPOINT_APP = 'ENDPOINT_APP',
  HUB = 'HUB',
  IR = 'IR',
  IR_OCF = 'IR_OCF',
  MQTT = 'MQTT',
  OCF = 'OCF',
  PENGYOU = 'PENGYOU',
  VIDEO = 'VIDEO',
  VIPER = 'VIPER',
  WATCH = 'WATCH',
}

registerEnumType(SmartThingsDeviceType, {
  name: 'SmartThingsDeviceType',
  description:
    'The type of device integration (may be null). If the type is DTH, the device implementation is a groovy Device Handler and the details are in the "dth" field. If the type is ENDPOINT_APP, the device implementation is a SmartApp and the details are in the "app" field. If the type is IR, the details are in the "ir" field. If the type is IR_OCF, the details are in the "irOcf" field. If the type is VIPER, the details are in the "viper" field.',
});
