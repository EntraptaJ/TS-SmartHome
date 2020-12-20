// src/Modules/Pills/PillInput.ts
import { Field, Float, InputType } from 'type-graphql';
import { Pill } from './PillModel';

@InputType()
export class PillInput implements Partial<Pill> {
  @Field({
    nullable: true,
  })
  public name: string;

  @Field(() => Float, {
    nullable: true,
  })
  public interval: number;

  @Field(() => Float, {
    nullable: true,
  })
  public minimumInterval: number;
}
