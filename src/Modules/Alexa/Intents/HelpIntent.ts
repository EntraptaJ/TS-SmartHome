// src/Modules/Extras/HelpIntent.ts
import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { config } from '../../../Library/Config';
import { IsIntent } from '../../../Utils/Helpers';
import { IntentTypes } from '../../../Utils/IntentTypes';

export const HelpIntent: RequestHandler = {
  canHandle(handlerInput: HandlerInput) {
    return IsIntent(handlerInput, IntentTypes.Help);
  },
  handle(handlerInput: HandlerInput) {
    const speechText = `Welcome to ${config.appName}.
    The actions you may perform are taking a pill with the command of "I've taken my pill", 
    you may also ask for the last time you took your pill with "When was the last time I took my pill", 
    you may ask if you can take your next pil yet with "Can I take my next pill already", 
    and finally you can ask when is the timeslot of the next dose with "When can I take my next pill"`;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(config.appName, speechText)
      .getResponse();
  },
};
