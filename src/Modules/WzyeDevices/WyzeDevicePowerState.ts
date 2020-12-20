// src/Modules/WyzeDevices/WyzeDevicePowerState.ts
import { registerEnumType } from 'type-graphql';

export enum WyzeDevicePowerState {
  OFF,
  ON,
}

registerEnumType(WyzeDevicePowerState, {
  name: 'WzyeDevicePowerState',
});
