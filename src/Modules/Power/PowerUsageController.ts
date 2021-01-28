// src/Modules/Power/PowerUsageController.ts
import { Queue, QueueScheduler, Worker } from 'bullmq';
import { format, startOfDay, subDays } from 'date-fns';
import { parse } from 'fast-xml-parser';
import got from 'got/dist/source';
import { Inject, Service } from 'typedi';
import { logger, LogMode } from '../../Library/Logger';
import { Config, configToken } from '../Config/ConfigSchema';
import { DayUsageParsedXML } from './DayUsageResponse';
import { PowerUsage } from './PowerUsageModel';

interface ProcessedXML {
  hourlyUsage: number[];
}

const powerCollectorQueKey = 'PowerCollector';

@Service()
export class PowerUsageController {
  @Inject(configToken)
  public config: Config;

  private isDayUsageResponse(xml: DayUsageParsedXML): xml is DayUsageParsedXML {
    if ('chart' in xml) {
      return true;
    }

    return false;
  }

  /**
   * Find or create the PowerUsage entity for a provided date
   * @param serviceDate Date for the requested power usage in the format of Month/Day/Year `1/17/2021`
   */
  public async getHourlyPowerUsage(serviceDate: string): Promise<PowerUsage> {
    let powerUsage = await PowerUsage.findOne({
      where: {
        usageDate: serviceDate,
      },
    });

    if (!powerUsage) {
      const responseXML = await this.getHourlyPowerUsageXML(serviceDate);

      const processedData = this.processPowerUsageXML(responseXML);

      powerUsage = PowerUsage.create({
        ...processedData,
        usageDate: new Date(serviceDate),
      });

      await powerUsage.save();
    }

    return powerUsage;
  }

  /**
   * Retrieve the Hourly power usage for a specified date
   *
   * @param serviceDate Date for the requested power usage in the format of Month/Day/Year `1/17/2021`
   * @returns Promise resolving to retrieved PowerUsage XML information from the utilities company
   */
  public async getHourlyPowerUsageXML(
    serviceDate: string,
  ): Promise<DayUsageParsedXML> {
    const response = await got.get(
      `https://tbslh.myutility.net/portal/prod/usage/index.weather.php?m=hod&sdp=23698152&ds=${serviceDate}&auth=${this.config.power.token}&cachetime=42a407e364cf59ab3436f66655bb4168&pele=0`,
    );

    const parsedXML = parse(response.body, { ignoreAttributes: false });

    if (this.isDayUsageResponse(parsedXML) === false) {
      throw new Error('Invalid data from API');
    }

    return parsedXML;
  }

  /**
   * Parse and format XML data to a better structured object
   * @param xmlData XML Response from utiltites company API
   * @returns Parsed and formatted object
   */
  public processPowerUsageXML(xmlData: DayUsageParsedXML): ProcessedXML {
    const hourlyUsage: number[] = new Array(24).fill(0);

    for (const dataSet of xmlData.chart.dataset) {
      const tieredHourlyUsage = dataSet.set?.map(
        ({ '@_value': value }) => parseFloat(value) || 0,
      );

      tieredHourlyUsage.map((value, index) => (hourlyUsage[index] += value));
    }

    return {
      hourlyUsage,
    };
  }

  /**
   * Start a Scheduler to collect power usage on a regular interval
   */
  public async startPowerUsageCollector(): Promise<void> {
    const CheckerQueScheduler = new QueueScheduler(powerCollectorQueKey, {
      connection: {
        host: process.env.REDIS_HOST || 'Redis',
      },
    });

    logger.log(
      LogMode.DEBUG,
      'Que Scheduler has been created: ',
      CheckerQueScheduler.name,
    );

    const CheckerQue = new Queue(powerCollectorQueKey, {
      connection: {
        host: process.env.REDIS_HOST || 'Redis',
      },
    });

    const cron = `35 */24 * * *`;

    const schedulerWorker = new Worker(
      powerCollectorQueKey,
      async () => {
        logger.log(LogMode.INFO, 'Running Task');

        const date = subDays(startOfDay(new Date()), 1);

        const powerUsage = await this.getHourlyPowerUsage(
          format(date, 'M/d/y'),
        );

        logger.log(LogMode.DEBUG, 'PowerUsage', powerUsage);
      },
      {
        connection: {
          host: process.env.REDIS_HOST || 'Redis',
        },
        concurrency: 1,
      },
    );
    logger.log(LogMode.DEBUG, `scheduleWorker: `, schedulerWorker.name);

    await CheckerQue.add(
      powerCollectorQueKey,
      {},
      {
        jobId: 'power',
        repeat: {
          cron,
        },
      },
    );
  }
}
