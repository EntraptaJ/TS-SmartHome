// src/Modules/Pills/NextPillIntent.ts
import { RequestHandler } from 'ask-sdk-core';
import { format, isPast, isToday } from 'date-fns';
import { HandlerInput } from '../../Library/Alexa/RequestInput';
import { IsIntent } from '../../Utils/Helpers';
import { IntentTypes } from '../../Utils/IntentTypes';
import { getPillIdFromSlot } from './getPill';

export const NextPillIntent: RequestHandler = {
  canHandle(handlerInput: HandlerInput) {
    return IsIntent(handlerInput, IntentTypes.NextPill);
  },
  async handle(handlerInput: HandlerInput) {
    if ('intent' in handlerInput.requestEnvelope.request) {
      const { slots } = handlerInput.requestEnvelope.request.intent;

      if (typeof slots?.pill !== 'undefined') {
        const pillId = getPillIdFromSlot(slots.pill);

        const pill = await handlerInput.context.pillService.findOne(pillId);

        const earliestNextDose = await pill.nextEarliestDose();

        let nextDoseString: string;
        if (isPast(earliestNextDose)) {
          nextDoseString = `was at ${format(earliestNextDose, 'PPPppp	')}`;
        } else if (isToday(earliestNextDose)) {
          nextDoseString = `is at ${format(earliestNextDose, 'p')}`;
        } else {
          nextDoseString = `on ${format(earliestNextDose, 'eeee')} at ${format(
            earliestNextDose,
            'p',
          )}`;
        }

        const speechText = `The earliest you may take your ${pill.name} ${nextDoseString}`;

        return handlerInput.responseBuilder
          .speak(speechText)
          .withSimpleCard('', speechText)
          .getResponse();
      }
    }

    const speechText = 'Invalid Pill';
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('', speechText)
      .getResponse();
  },
};
