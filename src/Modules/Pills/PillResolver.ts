// src/Modules/Pills/PillResolver.ts
import {
  Arg,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { CreatePillInput } from './CreatePillInput';
import { PillEventInput } from './PillEventInput';
import { PillEvent } from './PillEventModel';
import { PillEventType } from './PillEventType';
import { PillInput } from './PillInput';
import { Pill } from './PillModel';
import { PillService } from './PillService';

@Service()
@Resolver(Pill)
export class PillResolver {
  public constructor(
    @InjectRepository(Pill)
    private readonly pillRepository: Repository<Pill>,
    @InjectRepository(PillEvent)
    private readonly pillEventRepository: Repository<PillEvent>,
    private readonly pillService: PillService,
  ) {
    console.log('NumberAIResolver created!');
  }

  @Query(() => [Pill])
  public pills(): Promise<Pill[]> {
    return this.pillRepository.find();
  }

  @Mutation(() => [Date])
  public async createPillLog(
    @Arg('pillId', () => ID) pillId: string,
    @Arg('eventType', () => PillEventType, {
      nullable: true,
      defaultValue: PillEventType.TAKEN,
    })
    type: PillEventType,
  ): Promise<Date[]> {
    const pillEvents = await this.pillEventRepository.find({
      pillId,
      type,
    });

    return pillEvents.map(({ date }) => date);
  }

  @Mutation(() => [Pill])
  public async createPill(
    @Arg('input', () => CreatePillInput) input: CreatePillInput,
  ): Promise<Pill[]> {
    const pill = this.pillRepository.create(input);

    await this.pillRepository.save(pill);

    return this.pillRepository.find();
  }

  @Mutation(() => Pill)
  public async updatePill(
    @Arg('pillId', () => ID) pillId: string,
    @Arg('input', () => PillInput) input: PillInput,
  ): Promise<Pill> {
    const pill = await this.pillRepository.findOneOrFail(pillId);

    await this.pillRepository.update(pill, input);

    return this.pillRepository.findOneOrFail(pillId);
  }

  @Mutation(() => [Pill])
  public async deletePill(
    @Arg('pillId', () => ID) pillId: string,
  ): Promise<Pill[]> {
    const pill = await this.pillService.findOne(pillId);

    await this.pillRepository.remove(pill);

    return this.pillService.find();
  }

  @Mutation(() => Pill)
  public async createPillEvent(
    @Arg('pillId', () => ID) pillId: string,
    @Arg('input', () => PillEventInput) input: PillEventInput,
  ): Promise<Pill> {
    const pill = await this.pillRepository.findOneOrFail(pillId);

    const pillEvent = this.pillEventRepository.create({
      ...input,
      pill,
    });

    await this.pillEventRepository.save(pillEvent);

    return pill;
  }

  @Mutation(() => Pill)
  public async deletePillEvent(
    @Arg('pillEventId', () => ID) pillEventId: string,
  ): Promise<Pill> {
    const pillEvent = await this.pillEventRepository.findOneOrFail(pillEventId);

    const pill = await this.pillRepository.findOneOrFail(pillEvent.pillId);

    await this.pillEventRepository.remove(pillEvent);

    return pill;
  }

  @Mutation(() => Pill)
  public async takePill(
    @Arg('pillId', () => ID) pillId: string,
    @Arg('date', () => Date, {
      nullable: true,
      defaultValue: new Date(),
    })
    eventDate: Date,
  ): Promise<Pill> {
    const pill = await this.pillRepository.findOneOrFail(pillId);

    const pillEvent = this.pillEventRepository.create({
      date: eventDate,
      type: PillEventType.TAKEN,
      pill,
    });

    await this.pillEventRepository.save(pillEvent);

    return pill;
  }

  @FieldResolver(() => [PillEvent])
  public events(@Root() pill: Pill): Promise<PillEvent[]> {
    return this.pillEventRepository.find({
      pillId: pill.id,
    });
  }
}
