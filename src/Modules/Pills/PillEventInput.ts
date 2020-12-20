// src/Modules/Pills/PillEventInput.ts
import { Field, InputType } from 'type-graphql';
import { PillEvent } from './PillEventModel';
import { PillEventType } from './PillEventType';

@InputType()
export class PillEventInput implements Partial<PillEvent> {
  @Field(() => Date, {
    nullable: true,
    defaultValue: new Date(),
  })
  public date: Date;

  @Field(() => PillEventType, {
    nullable: true,
    defaultValue: PillEventType.TAKEN,
  })
  public type: PillEventType;
}
