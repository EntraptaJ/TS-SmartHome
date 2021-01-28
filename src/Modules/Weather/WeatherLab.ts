// src/Modules/Weather/WeatherLab.ts
import ecWeather, { CurrentConditionsEntry } from 'ec-weather';

enum EntryType {
  WARNING_WATCH = 'Warnings and Watches',
  CURRENT_CONDITIONS = 'Current Conditions',
  FORECASTS = 'Weather Forecasts',
}

export async function getWeather(): Promise<CurrentConditionsEntry> {
  const city = await ecWeather({
    city: 'on-135',
    lang: 'en',
  });

  let currentWeather: CurrentConditionsEntry | undefined;

  for (const entry of city.entries) {
    switch (entry.type) {
      case EntryType.WARNING_WATCH:
        console.log('Warning: ', entry);
        break;
      case EntryType.CURRENT_CONDITIONS:
        currentWeather = entry;
        console.log('Currently ', entry.temperature);
        break;
      case EntryType.FORECASTS:
        console.log(entry.summary);
        break;
    }
  }

  if (typeof currentWeather === 'undefined') {
    throw new Error('Invalid weather');
  }

  return currentWeather;
}
