// src/Modules/Pills/PillEventType.ts
import { registerEnumType } from 'type-graphql';

export enum PillEventType {
  TAKEN,
  SKIPPED,
}

registerEnumType(PillEventType, {
  name: 'PillEventType',
});
