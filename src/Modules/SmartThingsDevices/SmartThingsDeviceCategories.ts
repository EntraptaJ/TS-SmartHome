// src/Modules/SmartThingsDevices/SmartThingsCategories.ts
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class SmartThingsCategories {
  @Field()
  public name: string;
}
