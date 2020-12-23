// src/Modules/Pills/PillService.ts
import { addMinutes } from 'date-fns';
import { Service } from 'typedi';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { PillEvent } from './PillEventModel';
import { PillEventType } from './PillEventType';
import { Pill } from './PillModel';

@Service()
export class PillService {
  public constructor(
    @InjectRepository(Pill)
    private readonly pillRepository: Repository<Pill>,
    @InjectRepository(PillEvent)
    private readonly pillEventRepository: Repository<PillEvent>,
  ) {
    console.log('NumberAIResolver created!');
  }

  public createAndSavePill(input: Partial<Pill>): Promise<Pill> {
    const pill = this.pillRepository.create(input);

    return this.pillRepository.save(pill);
  }

  /**
   * Find one Pill
   */
  public findOne(
    pillId: string,
    options?: FindOneOptions<Pill>,
  ): Promise<Pill> {
    return this.pillRepository.findOneOrFail(pillId, options);
  }

  /**
   *
   * @param pill Find all
   */
  public find(opts?: FindManyOptions<Pill>): Promise<Pill[]> {
    return this.pillRepository.find(opts);
  }

  /**
   * Get the next earliest date the pill can be taken
   * @param pill The pill entity
   *
   * @returns Date of next earliest dose
   */
  public async getPillEarliestNextDose(pill: Pill): Promise<Date> {
    const pillEvents = await this.pillEventRepository.find({
      where: {
        pillId: pill.id,
      },
      take: 1,
      order: {
        date: 'DESC',
      },
    });

    const latestPillEvent = pillEvents[0];

    if (latestPillEvent) {
      return addMinutes(latestPillEvent.date, pill.minimumInterval * 60);
    }

    return new Date();
  }

  public async findOrFailPillEarliestDate(pillId: string): Promise<Date> {
    const pill = await this.findOne(pillId);

    return this.getPillEarliestNextDose(pill);
  }

  /**
   * Last dose
   */
  public async getLastPillEvent(pill: Pill): Promise<PillEvent> {
    const pillEvents = await this.pillEventRepository.find({
      where: {
        pillId: pill.id,
      },
      take: 1,
      order: {
        date: 'DESC',
      },
    });

    const latestPillEvent = pillEvents[0];
    if (!latestPillEvent) {
      throw new Error('Invalid Pill event');
    }

    return latestPillEvent;
  }

  /**
   * Take Pill
   */
  public async takePill(pill: Pill, date = new Date()): Promise<Pill> {
    const pillEvent = this.pillEventRepository.create({
      pill,
      pillId: pill.id,
      type: PillEventType.TAKEN,
      date,
    });

    await this.pillEventRepository.save(pillEvent);

    return pill;
  }

  /**
   * Find And Take Pill
   */
  public async findAndTakePill(pillId: string, date?: Date): Promise<Pill> {
    const pill = await this.findOne(pillId);

    return this.takePill(pill, date);
  }
}
