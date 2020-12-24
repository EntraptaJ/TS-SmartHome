// src/Library/Alexa/Alexa.ts
import { Skill, SkillBuilders, StandardSkillBuilder } from 'ask-sdk';
import { CustomSkillRequestHandler } from 'ask-sdk-core/dist/dispatcher/request/handler/CustomSkillRequestHandler';
import { ExpressAdapter } from 'ask-sdk-express-adapter';
import { Container } from 'typedi';
import { HelloWorldIntent } from '../../Modules/HelloWorld/HelloWorldIntent';
import { PillService } from '../../Modules/Pills/PillService';
import { findModuleFiles } from '../../Utils/moduleFileFinder';
import { logger, LogMode } from '../Logger';
import { FallbackIntent } from './Intents/FallbackIntent';
import { HelpIntent } from './Intents/HelpIntent';
import { LaunchIntent } from './Intents/LaunchIntent';
import { SessionEndedIntent } from './Intents/SessionEndedIntent';
import { StopIntent } from './Intents/StopIntent';

type IntentModule = { [key: string]: CustomSkillRequestHandler };

/**
 * Get all Alexa Intents
 */
export async function getIntents(): Promise<CustomSkillRequestHandler[]> {
  const modules = await findModuleFiles<IntentModule>(/.*Intent\.ts/);

  return modules.flatMap((fileModule) => Object.values(fileModule));
}

interface AlexaResponse {
  skillBuilder: StandardSkillBuilder;

  skill: Skill;

  alexaExpressAdapter: ExpressAdapter;
}

export async function createSkillBuilder(): Promise<AlexaResponse> {
  const intents = await getIntents();

  const skillBuilder = SkillBuilders.standard().addRequestHandlers(
    LaunchIntent,
    HelloWorldIntent,
    HelpIntent,
    StopIntent,
    SessionEndedIntent,
    FallbackIntent,
    ...intents,
  );

  const skill = skillBuilder.create();

  skillBuilder.addRequestInterceptors({
    process(handlerInput) {
      const containerId = handlerInput.requestEnvelope.request.requestId;

      const sessionContainer = Container.of(containerId);

      logger.log(LogMode.DEBUG, `newRequest process()`, containerId);

      handlerInput.context = {
        Container: sessionContainer,
        pillService: sessionContainer.get(PillService),
      };
    },
  });

  skillBuilder.addResponseInterceptors({
    process(handlerInput) {
      const containerId = handlerInput.requestEnvelope.request.requestId;

      logger.log(LogMode.DEBUG, `endRequest process()`, containerId);

      Container.reset(containerId);
    },
  });

  return {
    skillBuilder,
    skill,
    alexaExpressAdapter: new ExpressAdapter(skill, true, true),
  };
}
