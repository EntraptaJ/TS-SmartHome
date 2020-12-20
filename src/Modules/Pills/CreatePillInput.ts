// src/Modules/Pills/PillInput.ts
import { Field, Float, InputType } from 'type-graphql';
import { Pill } from './PillModel';

@InputType()
export class CreatePillInput implements Partial<Pill> {
  @Field()
  public name: string;

  @Field(() => Float)
  public interval: number;

  @Field(() => Float)
  public minimumInterval: number;
}
