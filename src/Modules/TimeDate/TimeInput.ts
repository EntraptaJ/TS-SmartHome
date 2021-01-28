// src/Modules/Extras/TimeInput.ts
import { Field, InputType, Int } from 'type-graphql';
import { TimeType } from './TimeType';

@InputType()
export class TimeInput {
  @Field(() => TimeType)
  public type: TimeType;

  @Field(() => Int)
  public time: number;
}
