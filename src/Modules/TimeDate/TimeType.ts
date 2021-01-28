// src/Modules/Extras/TimeType.ts
import { registerEnumType } from 'type-graphql';

export enum TimeType {
  MILLISECOND,
  SECOND,
  MINUTE,
  HOUR,
  DAY,
  WEEK,
  YEAR,
  DECADE,
}

registerEnumType(TimeType, {
  name: 'TimeType',
});
