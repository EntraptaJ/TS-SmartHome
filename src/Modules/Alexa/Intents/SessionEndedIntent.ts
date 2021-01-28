// src/Modules/Extras/SessionEndedIntent.ts
import { RequestHandler, HandlerInput } from 'ask-sdk-core';
import { config } from '../../../Library/Config';
import { IsType } from '../../../Utils/Helpers';
import { RequestTypes } from '../../../Utils/RequestTypes';

export const SessionEndedIntent: RequestHandler = {
  canHandle(handlerInput: HandlerInput) {
    return IsType(handlerInput, RequestTypes.SessionEnded);
  },
  handle(handlerInput: HandlerInput) {
    const speechText = `Goodbye!`;

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(config.appName, speechText)
      .getResponse();
  },
};
