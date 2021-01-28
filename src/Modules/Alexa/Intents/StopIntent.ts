// src/Modules/Extras/HelpIntent.ts
import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { config } from '../../../Library/Config';
import { logger, LogMode } from '../../../Library/Logger';
import { IsIntent } from '../../../Utils/Helpers';
import { IntentTypes } from '../../../Utils/IntentTypes';

export const StopIntent: RequestHandler = {
  canHandle(handlerInput: HandlerInput) {
    return IsIntent(handlerInput, IntentTypes.Stop);
  },
  handle(handlerInput: HandlerInput) {
    const speechText = `Goodbye. Have a great day!`;

    logger.log(
      LogMode.DEBUG,
      `StopIntent handle() handlerInput: `,
      handlerInput,
    );

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(config.appName, speechText)
      .withShouldEndSession(true)
      .getResponse();
  },
};
