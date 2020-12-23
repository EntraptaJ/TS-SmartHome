// src/Modules/Pills/LastPillIntent.ts
import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { logger, LogMode } from '../../Library/Logger';
import { IsIntent } from '../../Utils/Helpers';
import { IntentTypes } from '../../Utils/IntentTypes';

export const HelloWorldIntent: RequestHandler = {
  canHandle(handlerInput: HandlerInput) {
    return IsIntent(handlerInput, IntentTypes.HelloWorld);
  },
  handle(handlerInput: HandlerInput) {
    console.log(handlerInput.requestEnvelope);

    logger.log(
      LogMode.DEBUG,
      `HelloWorldIntent handle() `,
      handlerInput.serviceClientFactory?.getReminderManagementServiceClient(),
    );

    const speechText = `HelloWorld`;
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Testing', speechText)
      .getResponse();
  },
};
