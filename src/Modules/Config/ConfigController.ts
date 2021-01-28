// src/Modules/Config/ConfigController.ts
import Ajv from 'ajv';
import { AnyValidateFunction, DefinedError } from 'ajv/dist/core';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { readFile, writeFile } from 'fs/promises';
import Container, { Service } from 'typedi';
import { Config, configToken } from './ConfigSchema';
import { load } from 'js-yaml';
import { isAbsolute, resolve } from 'path';
import { fileURLToPath } from 'url';
import { logger, LogMode } from '../../Library/Logger';

@Service()
export class ConfigController {
  public async createSchema(): Promise<AnyValidateFunction<Config>> {
    logger.log(
      LogMode.DEBUG,
      `ConfigController.createSchema() Creating JSON Schema.`,
    );

    logger.log(
      LogMode.DEBUG,
      `ConfigController.createSchema() Dynamically importing ./ConfigSchema`,
    );
    await import('./ConfigSchema');
    const { Config, ...schemas } = validationMetadatasToSchemas();

    const coreSchema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      definitions: schemas,
      $id: 'Config',
      ...Config,
    };

    const ajv = new Ajv({
      schemas: [coreSchema],
    });

    const configSchema = ajv.getSchema<Config>('Config');

    if (!configSchema) {
      throw new Error('Invalid schema');
    }

    return configSchema;
  }

  public async processObject<
    T extends Record<string, string | Record<string, string>>
  >(obj: T): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const proccesedObj: T = {};

    for (const key in obj) {
      const value = obj[key];

      if (typeof value === 'string') {
        if (isAbsolute(value)) {
          console.log('Need to parse secret: ', value);

          const secretFile = await readFile(value);

          proccesedObj[key] = secretFile.toString() as typeof obj[typeof key];
        } else {
          proccesedObj[key] = value;
        }
      }

      if (typeof obj[key] === 'object') {
        proccesedObj[key] = (await this.processObject(
          value as Record<string, string>,
        )) as typeof obj[typeof key];
      }
    }

    return (proccesedObj as unknown) as T;
  }

  public async saveSchema(): Promise<void> {
    const schema = await this.createSchema();

    const schemaFilePath = resolve(
      fileURLToPath(import.meta.url),
      '../../../../Schemas/Config.json',
    );

    return writeFile(schemaFilePath, JSON.stringify(schema.schema));
  }

  public async loadConfig(): Promise<Config> {
    const configPath = process.env.CONFIG_PATH || 'config.yaml';

    const configValidator = await this.createSchema();

    const configFile = await readFile(configPath);
    const configYAML = load(configFile.toString());

    logger.log(LogMode.DEBUG, `loadConfig() loaded configYAML: `, configYAML);

    if (configValidator(configYAML)) {
      Container.set({
        global: true,
        id: configToken,
        value: await this.processObject(
          (configYAML as unknown) as Record<
            string,
            string | Record<string, string>
          >,
        ),
      });

      return Container.get(configToken);
    } else {
      // The type cast is needed to allow user-defined keywords and errors
      // You can extend this type to include your error types as needed.
      for (const err of configValidator.errors as DefinedError[]) {
        logger.log(LogMode.DEBUG, `Config.yaml error: `, err);
      }
    }

    throw new Error('Invalid config.yaml file');
  }
}
