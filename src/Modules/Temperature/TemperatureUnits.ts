// src/Modules/Temperature/Temperature.ts
import {} from 'type-graphql';
import {} from 'typeorm';
import Qty from 'js-quantities/esm';
import { convert } from 'convert';

export enum TemperatureUnits {
  C = 'celsius',
  F = 'fahrenheit',
}

type TemperatureKeys = 'C' | 'F';

export function getTempUnit<T extends TemperatureKeys>(
  fancy: T,
): T extends TemperatureKeys ? 'celsius' | 'fahrenheit' : false;
export function getTempUnit(
  fancy: TemperatureKeys,
): 'celsius' | 'fahrenheit' | false {
  return TemperatureUnits[fancy] || false;
}

export function processTemperatureToCelsius(tempString: string): number {
  const parsedTemperature = Qty.parse(tempString.replace('°', ''));

  const unit = parsedTemperature.units() as TemperatureKeys;

  const converted = convert(parsedTemperature.scalar);

  const tempUnit = getTempUnit(unit);

  if (tempUnit) {
    const value = converted.from(tempUnit).to('celsius');
    console.log('Procesing shit: ', value);

    return value;
  }

  throw new Error(`Invalid temperature string: ${tempString}`);
}
