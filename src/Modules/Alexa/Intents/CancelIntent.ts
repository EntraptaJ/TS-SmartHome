// src/Modules/Extras/CancelIntent.ts
import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { config } from '../../../Library/Config';
import { logger, LogMode } from '../../../Library/Logger';
import { IsIntent } from '../../../Utils/Helpers';
import { IntentTypes } from '../../../Utils/IntentTypes';

export const CancelIntent: RequestHandler = {
  canHandle(handlerInput: HandlerInput) {
    return IsIntent(handlerInput, IntentTypes.Cancel);
  },
  handle(handlerInput: HandlerInput) {
    const speechText = `Goodbye`;

    logger.log(LogMode.INFO, 'Cancel intent triggered', handlerInput);

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(config.appName, speechText)
      .getResponse();
  },
};
