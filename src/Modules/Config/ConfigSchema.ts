// src/Modules/Config/ConfigScshema.ts
// import jsonSchema from 'fluent-json-schema';
// import { powerConfigSchema } from '../Power/PowerConfigSchema';
import { JSONSchema } from 'class-validator-jsonschema';
import { IsString, ValidateNested } from 'class-validator';
import { PowerConfig } from '../Power/PowerConfigSchema';
import { Service, Token } from 'typedi';

@Service()
@JSONSchema({
  description: 'Service Configuration',
  additionalProperties: false,
  type: 'object',
})
export class Config {
  @IsString()
  @JSONSchema({
    description: 'Application name',
  })
  public name: string;

  @ValidateNested({})
  public power: PowerConfig;
}

export const configToken = new Token<Config>('config');
