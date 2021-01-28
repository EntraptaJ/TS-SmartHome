/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/Modules/Sensors/SensorController.ts
import { Service } from 'typedi';
import { Queue, QueueScheduler, Worker } from 'bullmq';
import { Sensor } from './SensorModel';
import { logger, LogMode } from '../../Library/Logger';
import { smartthings } from '../../Library/SmartThings';
import { SensorTemperature } from './SensorTemperatureModel';

const sensorCollectorKey = 'sensorCollector';

interface SensorResponse {
  temperatureMeasurement: {
    temperature: {
      value: number;

      unit: string;

      timestamp: string;
    };
  };
}

@Service()
export class SensorController {
  public async getSensorData(
    sensorId: string,
  ): Promise<SensorResponse | undefined> {
    const response = await smartthings.devices.getStatus(sensorId);

    if (response?.data?.components?.main) {
      return response?.data?.components?.main;
    }

    return undefined;
  }

  public async startSensorCollector(): Promise<void> {
    const CheckerQueScheduler = new QueueScheduler(sensorCollectorKey, {
      connection: {
        host: process.env.REDIS_HOST || 'Redis',
      },
    });
    logger.log(
      LogMode.DEBUG,
      'Que Scheduler has been created: ',
      CheckerQueScheduler.name,
    );

    const CheckerQue = new Queue(sensorCollectorKey, {
      connection: {
        host: process.env.REDIS_HOST || 'Redis',
      },
    });

    const cron = `*/5 * * * *`;

    const schedulerWorker = new Worker(
      sensorCollectorKey,
      async () => {
        logger.log(LogMode.INFO, `Checking sensors`);

        const sensors = await Sensor.find();

        const sensorIds = sensors.map(({ smartThingsId }) => smartThingsId);

        for (const sensorId of sensorIds) {
          logger.log(LogMode.INFO, 'Checking info for ', sensorId);

          const sensorData = await this.getSensorData(sensorId);

          if (!sensorData) {
            return;
          }

          if ('temperatureMeasurement' in sensorData) {
            const sensorResult = SensorTemperature.create({
              date: new Date(
                sensorData.temperatureMeasurement.temperature.timestamp,
              ),
              temperature: `${sensorData.temperatureMeasurement.temperature.value}${sensorData.temperatureMeasurement.temperature.unit}`,
              sensorId,
            });

            await sensorResult.save();
          }
        }
      },
      {
        connection: {
          host: process.env.REDIS_HOST || 'Redis',
        },
      },
    );
    logger.log(
      LogMode.DEBUG,
      `SensorController schedulerWorker`,
      schedulerWorker.name,
    );

    await CheckerQue.add(
      sensorCollectorKey,
      {},
      {
        jobId: 'sensors',
        repeat: {
          cron,
        },
      },
    );
  }
}
