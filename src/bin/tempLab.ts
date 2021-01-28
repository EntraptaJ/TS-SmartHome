// src/bin/tempLab.ts
import Qty from 'js-quantities/esm';
import { convert } from 'convert';

/**
 * celcius
 * farenheit
 */

enum TemperatureUnits {
  C = 'celsius',
  F = 'fahrenheit',
}

type TemperatureKeys = 'C' | 'F';
/*
type isTemperatureKey = <T extends TemperatureKeys>(
  unit: T,
) => T extends TemperatureKeys ? true : undefined; */

function getTempUnit<T extends TemperatureKeys>(
  fancy: T,
): T extends TemperatureKeys ? 'celsius' | 'fahrenheit' : false;
function getTempUnit(fancy: TemperatureKeys): 'celsius' | 'fahrenheit' | false {
  return TemperatureUnits[fancy] || false;
}

/* function helloWorld<T>(unit: T): T extends true ? 'fuck' : 'shit' {
  if (unit === '') {
    return 'fuck';
  }

  return 'shit';
} /* 

const helloWorld: isTemperatureKey = (unit) => {
  if (isTemperatureUnit(unit)) {
    return true;
  }
};
 
const hellOWorld1 = 'C' as const;

const tempKey = helloWorld(hellOWorld1);

function isTemperatureKey(
  key: string | TemperatureKeys,
): key is TemperatureKeys {
  return Object.keys(TemperatureUnits).includes(key);
}

function isTemperatureUnit<T>(unit: TemperatureKeys): unit is TemperatureKeys {
  return Object.keys(TemperatureUnits).includes(unit);
} */

const temperature = '-17.6°C';

const parsedTemperature = Qty.parse(temperature.replace('°', ''));

console.log(parsedTemperature);

const unit = parsedTemperature.units() as TemperatureKeys;

const converted = convert(parsedTemperature.scalar);

const tempUnit = getTempUnit(unit);

if (tempUnit) {
  converted.from(tempUnit).to('celsius');
}

console.log();

/* if ((unit)) {
  

  switch (unit) {
    case TemperatureUnits.CELCIUS:
      console.log('Celcius', converted.from('celsius'));
      break;
    case TemperatureUnits.FARENHEIT:
      console.log('Farenheit');
      break;
  }
}

console.log('parsedTemperature: ', parsedTemperature.scalar); */
/*
const converted = convert(parsedNumber);

console.log('converted: ', converted);
 */
