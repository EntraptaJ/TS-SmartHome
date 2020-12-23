// src/Modules/Pills/LastPillIntent.ts
import { RequestHandler } from 'ask-sdk-core';
import { format, isToday } from 'date-fns';
import { HandlerInput } from '../../Library/Alexa/RequestInput';
import { config } from '../../Library/Config';
import { IsIntent } from '../../Utils/Helpers';
import { IntentTypes } from '../../Utils/IntentTypes';
import { getPillIdFromSlot } from './getPill';
import { PillEventType } from './PillEventType';

export const LastPillIntent: RequestHandler = {
  canHandle(handlerInput: HandlerInput) {
    return IsIntent(handlerInput, IntentTypes.LastPill);
  },
  async handle(handlerInput: HandlerInput) {
    if ('intent' in handlerInput.requestEnvelope.request) {
      const { slots } = handlerInput.requestEnvelope.request.intent;

      if (typeof slots?.pill !== 'undefined') {
        const pillId = getPillIdFromSlot(slots.pill);

        const pill = await handlerInput.context.pillService.findOne(pillId);

        const lastPillEvent = await pill.latestPillEvent(PillEventType.TAKEN);

        let speechText: string;
        let formatedDate: string;

        if (typeof lastPillEvent === 'undefined') {
          speechText = `You have not taken your ${pill.name} yet`;
        } else {
          if (isToday(lastPillEvent.date)) {
            formatedDate = `at ${format(lastPillEvent.date, 'p')}`;
          } else {
            formatedDate = `on ${format(
              lastPillEvent.date,
              'eeee',
            )} at ${format(lastPillEvent.date, 'p')}`;
          }
          speechText = `You last took your ${pill.name} ${formatedDate}`;
        }

        return handlerInput.responseBuilder
          .speak(speechText)
          .withSimpleCard(config.appName, speechText)
          .getResponse();
      }
    }

    const speechText = 'Invalid Pill or unknown error';
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(config.appName, speechText)
      .getResponse();
  },
};
