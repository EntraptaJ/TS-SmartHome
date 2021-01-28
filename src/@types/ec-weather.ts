declare module 'ec-weather' {
  interface Options {
    lang: string;

    city: string;
  }

  export enum EntryType {
    WARNING_WATCH = 'Warnings and Watches',
    CURRENT_CONDITIONS = 'Current Conditions',
    FORECASTS = 'Weather Forecasts',
  }

  interface Entry {
    type: EntryType;

    title: string;

    link: string;

    updated: string;

    published: string;

    summary: string;
  }

  interface WarningEntry extends Entry {
    type: EntryType.WARNING_WATCH;

    inEffect: boolean;
  }

  interface CurrentConditionsEntry extends Entry {
    type: EntryType.CURRENT_CONDITIONS;

    observedAt: string;

    condition: string;

    temperature: string;

    pressureTendency: string;

    visibility: string;

    humidity: string;

    dewpoint: string;

    wind: string;

    airQualityHealthIndex: string;
  }

  interface WeatherForecastEntry extends Entry {
    type: EntryType.FORECASTS;
  }

  type ResponseEntry =
    | WarningEntry
    | CurrentConditionsEntry
    | WeatherForecastEntry;

  interface Response {
    lang: string;
    city: string;
    title: string;
    badgeUrl: string;
    author: {
      name: 'Environment Canada';
      uri: 'http://www.weather.gc.ca';
    };
    updated: string;
    rights: string;

    entries: ResponseEntry[];
  }

  export default function (options: Options): Promise<Response>;
}
