// src/Modules/Extras/DurationInput.ts
import { Duration } from 'date-fns';
import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class DurationInput implements Partial<Duration> {
  @Field(() => Int, {
    nullable: true,
  })
  public seconds?: number;

  @Field(() => Int, {
    nullable: true,
  })
  public minutes?: number;
}
