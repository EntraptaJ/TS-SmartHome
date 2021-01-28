// src/Modules/Countdown/CountdownInput.ts
import {} from '';
import { Field, InputType } from 'type-graphql';
import { Countdown } from './CountdownModel';

@InputType()
export class CountdownInput implements Partial<Countdown> {
  @Field(() => Date)
  public targetDate: Date;
}
