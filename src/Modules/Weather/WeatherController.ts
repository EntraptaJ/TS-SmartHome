// src/Modules/Weather/WeatherController.ts

import ecWeather, { CurrentConditionsEntry } from 'ec-weather';
import { Queue, QueueScheduler, Worker } from 'bullmq';
import { logger, LogMode } from '../../Library/Logger';

enum EntryType {
  WARNING_WATCH = 'Warnings and Watches',
  CURRENT_CONDITIONS = 'Current Conditions',
  FORECASTS = 'Weather Forecasts',
}

const weatherQueKey = 'weatherCheck';

export class WeatherController {
  public cityCode: string;

  public constructor(cityCode: string) {
    this.cityCode = cityCode;
  }

  public async getCurrentWeather(): Promise<CurrentConditionsEntry> {
    const city = await ecWeather({
      city: this.cityCode,
      lang: 'en',
    });

    let currentWeather: CurrentConditionsEntry | undefined;

    for (const entry of city.entries) {
      switch (entry.type) {
        case EntryType.WARNING_WATCH:
          break;
        case EntryType.CURRENT_CONDITIONS:
          currentWeather = entry;
          break;
        case EntryType.FORECASTS:
          break;
      }
    }

    if (typeof currentWeather === 'undefined') {
      throw new Error('Invalid weather');
    }

    return currentWeather;
  }

  public async startCheckerQue(): Promise<void> {
    const CheckerQueScheduler = new QueueScheduler(weatherQueKey, {
      connection: {
        host: process.env.REDIS_HOST || 'Redis',
      },
    });

    console.log('Que Scheduler has been created: ', CheckerQueScheduler.name);

    const CheckerQue = new Queue(weatherQueKey, {
      connection: {
        host: process.env.REDIS_HOST || 'Redis',
      },
    });

    const cron = `30 */3 * * *`;

    const schedulerWorker = new Worker(
      weatherQueKey,
      async () => {
        logger.log(LogMode.DEBUG, `Checking weather`);

        const weather = await this.getCurrentWeather();

        logger.log(LogMode.DEBUG, `Weather`, weather.temperature);
        console.log('Created Weather Scheduler');
      },
      {
        connection: {
          host: process.env.REDIS_HOST || 'Redis',
        },
      },
    );
    logger.log(
      LogMode.DEBUG,
      `weatherController schedulerWorker`,
      schedulerWorker.name,
    );

    await CheckerQue.add(
      weatherQueKey,
      {},
      {
        jobId: 'weather',
        repeat: {
          cron,
        },
      },
    );
  }
}
