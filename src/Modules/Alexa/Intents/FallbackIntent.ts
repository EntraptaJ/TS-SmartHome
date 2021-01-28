// src/Modules/Extras/FallbackIntent.ts
import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { config } from '../../../Library/Config';
import { logger, LogMode } from '../../../Library/Logger';
import { IsIntent } from '../../../Utils/Helpers';
import { IntentTypes } from '../../../Utils/IntentTypes';

export const FallbackIntent: RequestHandler = {
  canHandle(handlerInput: HandlerInput) {
    return IsIntent(handlerInput, IntentTypes.Fallback);
  },
  handle(handlerInput: HandlerInput) {
    const speechText = `That action does not exist. Goodbye`;

    logger.log(LogMode.INFO, 'Fallback intent triggered', handlerInput);

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(config.appName, speechText)
      .withShouldEndSession(true)
      .getResponse();
  },
};
