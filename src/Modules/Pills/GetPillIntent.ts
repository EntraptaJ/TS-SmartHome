// src/Modules/Pills/GetPillIntent.ts
import { RequestHandler } from 'ask-sdk-core';
import { HandlerInput } from '../../Library/Alexa/RequestInput';
import { IsIntent } from '../../Utils/Helpers';
import { IntentTypes } from '../../Utils/IntentTypes';
import { getPillIdFromSlot } from './getPill';

export const GetPillIntent: RequestHandler = {
  canHandle(handlerInput: HandlerInput) {
    return IsIntent(handlerInput, IntentTypes.GetPill);
  },
  async handle(handlerInput: HandlerInput) {
    if ('intent' in handlerInput.requestEnvelope.request) {
      const { slots } = handlerInput.requestEnvelope.request.intent;

      if (typeof slots?.pill !== 'undefined') {
        const pillId = getPillIdFromSlot(slots.pill);

        const pill = await handlerInput.context.pillService.findOne(pillId);

        console.log('Returning pill: ', pill);

        const speech = `Your ${
          pill.name
        } is taken once every ${pill.interval.toPrecision()} hours with the ability to take every ${pill.minimumInterval.toPrecision()} hours`;

        return handlerInput.responseBuilder
          .speak(speech)
          .withShouldEndSession(true)
          .getResponse();
      }
    }

    const speech = 'Thank you.';

    return handlerInput.responseBuilder
      .speak(speech)
      .reprompt(speech)
      .getResponse();
  },
};
