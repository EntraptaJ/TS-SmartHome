// src/Library/Alexa/Alexa.ts
import { SkillBuilders } from 'ask-sdk';
import { ExpressAdapter } from 'ask-sdk-express-adapter';
import { Container } from 'typedi';
import { HelloWorldIntent } from '../../Modules/HelloWorld/HelloWorldIntent';
import { CanTakePillIntent } from '../../Modules/Pills/CanTakePillIntent';
import { CreatePillIntent } from '../../Modules/Pills/CreatePillIntent';
import { GetPillIntent } from '../../Modules/Pills/GetPillIntent';
import { LastPillIntent } from '../../Modules/Pills/LastPillIntent';
import { ListPillsIntent } from '../../Modules/Pills/ListPillsIntent';
import { NextPillIntent } from '../../Modules/Pills/NextPillIntent';
import { PillService } from '../../Modules/Pills/PillService';
import { TakePillIntent } from '../../Modules/Pills/TakePillIntent';
import { FallbackIntent } from './Intents/FallbackIntent';
import { HelpIntent } from './Intents/HelpIntent';
import { LaunchIntent } from './Intents/LaunchIntent';
import { SessionEndedIntent } from './Intents/SessionEndedIntent';
import { StopIntent } from './Intents/StopIntent';

export const skillBuilder = SkillBuilders.standard()
  .addRequestHandlers(
    LaunchIntent,
    HelloWorldIntent,
    HelpIntent,
    StopIntent,
    SessionEndedIntent,
    FallbackIntent,
    CreatePillIntent,
    TakePillIntent,
    NextPillIntent,
    CanTakePillIntent,
    ListPillsIntent,
    GetPillIntent,
    LastPillIntent,
  )
  .addRequestInterceptors({
    process(handlerInput) {
      const sessionContainer = Container.of(
        handlerInput.requestEnvelope.session?.sessionId ||
          handlerInput.requestEnvelope.request.requestId,
      );

      handlerInput.context = {
        Container: sessionContainer,
        pillService: sessionContainer.get(PillService),
      };
    },
  });
const skill = skillBuilder.create();

export const alexaExpressAdapter = new ExpressAdapter(skill, true, true);
