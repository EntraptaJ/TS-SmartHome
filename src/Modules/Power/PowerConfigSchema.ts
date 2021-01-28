// src/Modules/Power/PowerConfigSchema.ts
import { JSONSchema } from 'class-validator-jsonschema';
import { IsString } from 'class-validator';

@JSONSchema({
  description: 'Power Collection configrutation',
  additionalProperties: false,
  type: 'object',
})
export class PowerConfig {
  @IsString()
  @JSONSchema({
    description: 'Sioux Hydro Auth Token',
  })
  public token: string;
}
