// src/Modules/WyzeDevices/WyzeCameraThumbnailParams.ts
import { Field, Float, ObjectType } from 'type-graphql';

@ObjectType()
export class WyzeCameraThumbnailParams {
  @Field(() => Float)
  public thumbnails_ts: number;

  @Field()
  public thumbnails_url: string;
}
